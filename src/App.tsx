import { useState } from 'react'

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

    // Always clear highlights when code has changed
    setHighlights([])

    try {
      const result = railID(newCode)
      setResult(result)
      setError(undefined)
      
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
        }
      } else console.error(e)
    }
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
