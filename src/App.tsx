import { useEffect, useRef, useState } from 'react'

import railID, { RailID, ParseError, isParseError } from 'rail-id'
import { useDelay } from 'react-use-precision-timer'

import './App.css'
import 'bulma/css/bulma.css'

import AttrRouter from './components/FieldRouter'
import CodeBox from './components/CodeBox'
import WarningPanel from './components/WarningPanel'
import ErrorPanel from './components/ErrorPanel'
import { scrollTo, ScrollTarget } from './util'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export type SetHighlights = React.Dispatch<React.SetStateAction<number[]>>

export type CodeState = 'incomplete' | 'complete' | 'error'
export type AppError = ParseError | 'unknown' | undefined


function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<RailID | undefined>()
  const [highlights, setHighlights] = useState<number[]>([])
  const [error, setError] = useState<AppError>()

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
  const keepTypingTimer = useDelay(1600, () => {
    if (code.length > 0) {
      setShowKeepTyping(true)
      scrollToCodeBox()
    }
  })
  const startKeepTyping = () => { keepTypingTimer.start(); setShowKeepTyping(false) }
  const stopKeepTyping = () => { keepTypingTimer.stop(); setShowKeepTyping(false) }


  // Handle code change and update state
  function onChange(newCode: string) {
    setCode(newCode)
    setHighlights([]) // Always clear highlights when code has changed
    startKeepTyping()

    try {
      const result = railID(newCode, { logLevel: 'none' })
      setResult(result)
      setError(undefined)
      scrollToCodeBox()
      stopKeepTyping()
    } catch (e) {
      if (isParseError(e)) {
        const pe = e as ParseError
        setError(pe)
        stopKeepTyping()
        if (pe.incompleteInput) {
          startKeepTyping()

          // If user clears input, reset everything
          if (newCode.trim().length === 0) {
            setCode('')
            setResult(undefined)
            setError(undefined)
            scrollTo('top')
          }
        } else {
          scrollToCodeBox()
        }
      } else {
        setError('unknown')
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
  const bodyStyle = result && error ? { opacity: '0.15', pointerEvents: 'none' } : {}

  // Classes placed at a parent element to enable highlighting select parts of the code
  const highlightClasses = highlights.map(n => `pos-${n}`).join(' ')

  const statusClass = () => {
    if (result && !error) {
      if (result._meta.warnings.length > 0) return 'status-warn'
      else return 'status-valid'
    } else return ''
  }


  return (
    <div className="rail-id">
      <div>
        <img src="/rail-id.svg" className="logo" alt="Rail ID logo" />
        {/*<a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>*/}
      </div>
      <h1>Rail ID</h1>
      <h3>The European rolling stock code reader</h3>
      <div ref={scrollRef} id="scroll-target" />
      <div className={`code-box-container ${statusClass()} ${highlightClasses}`}>
        <CodeBox code={code} onChange={onChange} error={error} />
      </div>
      <ErrorPanel error={error} />
      <WarningPanel result={result} error={error} setHighlights={setHighlights} />
      <div className="keep-typing-msg" style={{ display: showKeepTyping ? 'inherit' : 'none' }}>
        <FontAwesomeIcon icon={faCircleExclamation} />
        <span>This code is too short... keep typing!</span>
      </div>
      <div className="body column" style={bodyStyle} >
        <AttrRouter result={result} setHighlights={setHighlights} />
      </div>
    </div>
  )
}

export default App
