import { createRef, useEffect, useRef, useState } from 'react'
import { useDelay } from 'react-use-precision-timer'
import { useDebouncedCallback } from 'use-debounce'

import railID, { RailID, ParseError, isParseError } from 'rail-id'

import './App.scss'
import 'bulma/css/bulma.css'

import FieldRouter from './components/FieldRouter'
import CodeBox from './components/CodeBox'
import WarningPanel from './components/WarningPanel'
import ErrorPanel from './components/ErrorPanel'
import { scrollTo, ScrollTarget, empty } from './util'
import { faCircleExclamation, faTrainSubway } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Share from './components/Share'


export type AppError =
  { type: 'parse-error', ref: ParseError } |
  { type: 'internal', ref: unknown } |
  { type: 'none' }

export type HighlightState = 'clear' | { origin: string, source: number[]  }
export type SetHighlights = React.Dispatch<React.SetStateAction<HighlightState>>

// Determines whether an error should be displayed to user (included 'none')
const isBenign = (error: AppError) => (error.type === 'none' || error.type === 'parse-error' && error.ref.incompleteInput)

function App({ codeParam }: { codeParam?: string }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<RailID | undefined>()
  const [highlights, setHighlights] = useState<HighlightState>('clear')
  const [error, setErrorImmediate] = useState<AppError>({ type: 'none' })
  const setErrorDebounce = useDebouncedCallback(setErrorImmediate, 900)
  const setError = (newError: AppError) => {
    setErrorDebounce(newError)

    // If clearing an error, or if going from one non-benign state to another, immediately update
    if (!isBenign(error) || isBenign(newError)) setErrorDebounce.flush()
  }

  // Ref and effect to allow blurring the CodeBox
  const boxRef = createRef<HTMLElement>()
  const [doBlur, setDoBlur] = useState(false)
  useEffect(() => {
    boxRef.current?.blur()
    if (doBlur) setDoBlur(false)
  }, [ doBlur ])

  // Use `codeParam` url parameter if passed
  useEffect(() => {
    if (codeParam && !empty(codeParam)) {
      onChange(codeParam)
      setDoBlur(true)
    }
  }, [/* onMount */])

  //DEBUG
  //printState()
  //
  //function printState() {
  //  console.log('--------------------------------')
  //  console.log(`code ==> '${code}'`)
  //  console.log(`highlights ==> ${highlights.join(', ')}`)
  //  console.log('result ==>', result)
  //  console.log('error ==>', error)
  //  console.log('--------------------------------')
  //}


  // Keep typing prompt
  const [showKeepTyping, setShowKeepTyping] = useState<boolean>(false)
  const keepTypingTimer = useDelay(2200, () => {
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


  // Handle code change and update state
  function onChange(newCode: string) {
    setCode(newCode)
    setHighlights('clear') // Always clear highlights when code has changed
    startKeepTyping()

    try {
      const result = railID(newCode, { logLevel: 'none' })
      setResult(result)
      setError({ type: 'none' })
      scrollToCodeBox()
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
        }
      } else {
        setError({ type: 'internal', ref: e })
        console.error(e)
      }
    }
  }
  
  // Auto-scrolling
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTarget, setScrollTarget] = useState<ScrollTarget>('none')
  const scrollToCodeBox = () => setScrollTarget({ type: 'element', element: scrollRef.current })
  useEffect(() => { scrollTo(scrollTarget); setScrollTarget('none') })

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
  }), [/* onMount only */])

  return (
    <div id="rail-id">

      <FontAwesomeIcon className="logo" icon={faTrainSubway} />
      <h1>Rail ID</h1>
      <h3>The European rolling stock code reader</h3>

      <div ref={scrollRef} id="scroll-target" />

      <div className="controls columns is-centered">
        <div className="mask" />
        <div className="controls-inner column is-12-mobile is-10-tablet is-8-desktop is-8-widescreen is-7-fullhd">
          <CodeBox code={code} error={error} onChange={onChange} onReset={() => onChange('')} className={codeboxClasses()} ref={boxRef} />
          <div className="feedback">
            <ErrorPanel error={error} />
            <WarningPanel result={result} error={error} highlights={highlights} setHighlights={setHighlights} />
            <div className="keep-typing-msg fade-in" style={ showKeepTyping ? {} : { display: 'none' }}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>This code is too short. Keep typing!</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`results ${disableResults}`} >
        <FieldRouter result={result} highlights={highlights} setHighlights={setHighlights} />
        { result && isBenign(error) ? <Share code={code} /> : <></> }
      </div>

    </div>
  )
}

export default App