import { useEffect, useRef, useState } from 'react'

import railID, { RailID, ParseError, isParseError } from 'rail-id'

import './App.css'
import 'bulma/css/bulma.css'
//TODO import reactLogo from './assets/react.svg'

import AttrRouter from './components/FieldRouter'
import CodeBox from './components/CodeBox'
import WarningPanel from './components/WarningPanel'
import ErrorPanel from './components/ErrorPanel'


export type SetHighlights = React.Dispatch<React.SetStateAction<number[]>>

function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<RailID | undefined>()
  const [highlights, setHighlights] = useState<number[]>([])
  const [error, setError] = useState<ParseError | undefined>()

  //DEBUG
  printState()

  function onChange(newCode: string) {
    setCode(newCode)
    setHighlights([]) // Always clear highlights when code has changed

    try {
      const result = railID(newCode)
      setResult(result)
      setError(undefined)
      setScrollTarget('code-box')//TODO
    } catch (e) {
      if (isParseError(e)) {
        const pe = e as ParseError
        if (pe.incompleteInput) {
          // If user clears input, reset everything
          if (newCode.trim().length === 0) {
            setCode('')
            setResult(undefined)
            setError(undefined)
          }
        } else {
          setError(pe)
          setResult(undefined)
          setScrollTarget('top')
        }
      } else console.error(e)
    }
  }

  // Auto-scrolling
  const [scrollTarget, setScrollTarget] = useState<ScrollTarget>('none')
  const scrollRef = useRef<Element>()

  useEffect(() => scrollTo(scrollTarget))
  type ScrollTarget = 'top' | 'code-box' | 'none'

  const scrollTo = (target: ScrollTarget) => {
    if (target === 'top') window.scrollTo({ top: 0 })
    if (target === 'code-box') {
      const rect = scrollRef.current?.getBoundingClientRect()
      if (rect) {
        const bodyRect = document.body.getBoundingClientRect()
        const top = rect.top - bodyRect.top;
        window.scrollTo({ top })
      }
    }
    setScrollTarget('none') // clear state
  }

  function printState() {
    console.log({
      code,
      highlights,
      result,
      error
    })
  }

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
      <h3>A tool for interpreting European train codes</h3>
      <span ref={scrollRef} id="scroll-target" />
      <div className={`code-box-container ${statusClass()} ${highlightClasses}`}>
        <CodeBox code={code} onChange={onChange} error={error} />
      </div>
      <ErrorPanel error={error} />
      <WarningPanel result={result} setHighlights={setHighlights} />
      <div className="body column">
        <AttrRouter result={result} setHighlights={setHighlights} />
      </div>
    </div>
  )
}

export default App
