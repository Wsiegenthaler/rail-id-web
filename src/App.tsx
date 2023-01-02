import React, { createContext, createRef, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useDelay } from 'react-use-precision-timer'
import { useDebouncedCallback } from 'use-debounce'
import { isMobile } from 'detect-touch-device'
import { usePersistentState } from 'react-shared-storage'

import railID, { RailID, ParseError, isParseError } from 'rail-id'

import { faArrowPointer, faCircleExclamation, faCircleInfo, faFileCode, faHandPointUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import FieldRouter from './components/FieldRouter'
import CodeBox, { CodeBoxRef } from './components/CodeBox'
import WarningPanel from './components/WarningPanel'
import ErrorPanel from './components/ErrorPanel'
import Share from './components/Share'
import UncachedSvg from './components/util/UncachedSvg'

import { scrollTo, ScrollTarget, empty, isBenign, randomDemoCode, useOnScreen } from './util'

import './App.scss'

//TODO extract needed styles
import './style/layout.scss'

import LogoSrc from './logo.svg?raw'
import { HighlightContextType, HighlightState } from './components/util/highlight'


export type AppError =
  { type: 'parse-error', ref: ParseError } |
  { type: 'internal', ref: unknown } |
  { type: 'none' }

type AppInfo = {
  pkgName: string
  name: string
  description: string
  version: string
  license: string
  repository: string
}

type AppProps = {
  appInfo: AppInfo
  codeParam?: string
}

export const HighlightContext = createContext<HighlightContextType | null>(null)


function App({ codeParam, appInfo }: AppProps) {

  // App state
  const [code, setCode] = useState('')
  const [result, setResult] = useState<RailID | undefined>()
  const [highlights, setHighlights] = useState<HighlightState>('clear')

  // Error state
  const [error, setErrorImmediate] = useState<AppError>({ type: 'none' })
  const setErrorDebounce = useDebouncedCallback(setErrorImmediate, 800)
  const setError = (newError: AppError) => {
    setErrorDebounce(newError)

    // If clearing an error, or if going from one non-benign state to another, immediately update
    if (!isBenign(error) || isBenign(newError)) setErrorDebounce.flush()
  }

  const boxRef = createRef<CodeBoxRef>()

  // Use `codeParam` url parameter if passed
  useEffect(() => {
    if (codeParam && !empty(codeParam)) {
      onChange(codeParam)
      boxRef.current?.blur()
      setTimeout(() => scrollToCodeBox(), 900)
    } else {
      boxRef.current?.focus()
    }
  }, [/* onMount */])


  // Keep typing prompt
  const [showKeepTyping, setShowKeepTyping] = useState<boolean>(false)
  const keepTypingTimer = useDelay(2000, () => {
    if (code.length > 0) {
      if (error.type === 'none' || error.type === 'parse-error' && error.ref.incompleteInput) {
        setShowKeepTyping(true)
        scrollToCodeBox()
      }
    }
  })
  useEffect(() => keepTypingTimer.stop(), []) // Prevent timer from starting on mount
  const startKeepTyping = () => { keepTypingTimer.start(); setShowKeepTyping(false) }
  const stopKeepTyping = () => { keepTypingTimer.stop(); setShowKeepTyping(false) }


  // Welcome message
  const showWelcome = !result && isBenign(error) && empty(code) && !showKeepTyping
  const demo = () => onChange(randomDemoCode())

  // Sourcemap tip message
  const [ didDismissTip, setDidDismissTip ] = usePersistentState('didDismissTip', false)
  const showSourcemapTip = !didDismissTip && result && isBenign(error) && !empty(code) && !showKeepTyping
  const dismissTip: MouseEventHandler<HTMLButtonElement> = ev => setDidDismissTip(true)

  // Auto-scrolling
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTarget, setScrollTarget] = useState<ScrollTarget>('none')
  const isScrollTargetVisible = useOnScreen(scrollRef)
  const scrollToCodeBox = () => setScrollTarget({ type: 'element', element: scrollRef.current })
  useEffect(() => { scrollTo(scrollTarget); setScrollTarget('none') })

  // Handle code change and update state
  function onChange(newCode: string) {
    setCode(newCode)
    setHighlights('clear') // Always clear highlights when code has changed
    startKeepTyping()

    try {
      // Parse
      const result = railID(newCode, { metadata: true, markdown: true, logLevel: 'none' })
      
      // Update code to reflect version cleaned by parser
      setCode(result._meta.input.cleanInput)

      // Set result and clear error
      setResult(result)
      setError({ type: 'none' })

      // Scroll to code box 
      if (isScrollTargetVisible) scrollToCodeBox()
      
      // Hide keep typing message
      stopKeepTyping()

    } catch (e) {
      if (isParseError(e)) {
        const pe = e as ParseError
        setError({ type: 'parse-error', ref: pe })
        stopKeepTyping()
        if (pe.incompleteInput) {
          // If user clears input, reset everything
          if (empty(newCode)) {
            setCode('')
            setResult(undefined)
            setError({ type: 'none' })
          } else startKeepTyping()
        } else {
          // Update code to reflect version cleaned by parser
          setCode(pe.cleanInput)
        }
      } else {
        setError({ type: 'internal', ref: e })
        console.error(e)
      }
    }
  }
 
  // Whether to temporarily fade/disable results
  const disableResults = result && error.type !== 'none' ? 'disable' : ''

  // CodeBox highlights and warn/valid border classes
  const codeboxClasses = () => {
    // Classes placed at a parent element to enable highlighting select parts of the code
    const hls = highlights !== 'clear' ? highlights.source.map(n => `pos-${n}`) : []

    // Code status
    let status = ''
    if (result && error.type === 'none') {
      if (result._meta.warnings.length > 0) status = 'warn'
      else status = 'valid'
    }

    return [ status, ...hls ].join(' ')
  }

  // Catch touch events to disable highlight selection
  useEffect(() => document.addEventListener('touchstart', ev => {
    ev.stopPropagation()
    setHighlights('clear')
  }), [/* onMount */])

  return (
    <HighlightContext.Provider value={({ state: highlights, set: setHighlights })}>
      <div id="rail-id">
        <div className="body">

          <UncachedSvg className="logo" src={LogoSrc} />
          <h1>{appInfo.name}</h1>
          <h3>{appInfo.description}</h3>

          <div ref={scrollRef} id="scroll-target" />

          <div className="controls columns is-centered">
            <div className="mask" />
            <div className="controls-inner column is-11-mobile is-11-tablet is-9-desktop is-9-widescreen is-8-fullhd">
              <CodeBox code={code} error={error} onChange={onChange} onReset={() => onChange('')} className={codeboxClasses()} ref={boxRef} />
              <div className="feedback">

                <ErrorPanel error={error} />

                <WarningPanel result={result} error={error} />

                <div className="welcome" style={ showWelcome ? {} : { display: 'none' }}>
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <span>Enter a UIC code to learn about a vehicle or see an <a onClick={e => demo()}>example</a></span>
                </div>

                <div className="keep-typing-msg fade-in" style={ showKeepTyping ? {} : { display: 'none' }}>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  <span>This code is too short. Keep typing!</span>
                </div>

              </div>
            </div>
          </div>

          <div className={`results ${disableResults}`} >

            <div className="sourcemap-tip" style={ showSourcemapTip ? {} : { display: 'none' }}>
              { isMobile ?
                <FontAwesomeIcon icon={faHandPointUp} /> :
                <FontAwesomeIcon icon={faArrowPointer} /> }
                <span>{ isMobile ? 'Tap' : 'Hover over' } results to see which part of the code they correspond to.</span>
                <button onClick={dismissTip}>Dismiss</button>
            </div>

            <FieldRouter result={result} />

            { result ? <Share code={code} /> : <></> }
          </div>
        </div>

        <div className="foot">
          <span className="repo">
            <a href={appInfo.repository} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFileCode} />
              {appInfo.pkgName}
            </a>
          </span>
          <span className="version">{appInfo.version}</span>
          <span className="license">{appInfo.license}</span>
        </div>
      </div>
    </HighlightContext.Provider>
  )
}

export default App