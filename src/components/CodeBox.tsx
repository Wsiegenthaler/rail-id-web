import React from 'react'
import {
  useEffect,
  useState,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  forwardRef,
  ForwardedRef,
  useRef,
  useImperativeHandle
} from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import { AppError } from '../App'
import { empty } from '../util'

type Props = {
  code: string
  onChange: (code: string) => void
  error: AppError
  className?: string
  onReset?: () => void
}

export type CodeBoxRef = {
  focus: () => void,
  blur: () => void
}

function dismissKeyboardOnEnter(ev: KeyboardEvent<HTMLElement>) {
  const key = ev.code ?? ev.keyCode.toString()
  if (key === 'Enter' || key === '13') ev.currentTarget.blur()
}

type CaretState = { kind: 'blur' } | { kind: 'caret', pos: number } | { kind: 'selection', start: number, end: number }

const CodeBox = forwardRef(({ code, onChange, error, onReset, className = '' }: Props, forwardRef: ForwardedRef<CodeBoxRef>) => {
  
  const [caretState, setCaretState] = useState<CaretState>({ kind: 'blur' })

  const localRef = useRef<HTMLElement | null>(null)

  // Exposed imperative functionality for parent components
  useImperativeHandle(forwardRef, () => ({
    focus: () => localRef.current?.focus(),
    blur: () => localRef.current?.blur()
  }))

  // Updates component state to reflect the current caret position/selection
  const syncCaretState = () => setCaretState(detectCaretState())

  // Whether our contenteditable is the currently active element
  const isFocused = () => localRef.current && document.activeElement === localRef.current

  // Inspects window/document to determine current caret position/selection
  const detectCaretState = (): CaretState => {
    const sel = window.getSelection()
    const r = (sel?.rangeCount ?? 0) > 0 ? sel?.getRangeAt(0) : undefined
    if (!r && isFocused()) {
      // Sometimes the Chrome/Safari `Selection` api doesn't return any ranges upon
      // first focus after page load. We catch it here so it's not treated as a blur.
      return { kind: 'caret', pos: 0 }
    } else if (r && isFocused()) {
      const node = localRef.current as Node
      if (r.collapsed) {
        const r1 = r.cloneRange()
        r1.selectNodeContents(node)
        r1.setEnd(r.endContainer, r.endOffset)
        const pos = r1.toString().length
        return { kind: 'caret', pos }
      } else {
        const r1 = r.cloneRange(), r2 = r.cloneRange()
        r1.selectNodeContents(node)
        r2.selectNodeContents(node)
        r1.setEnd(r.startContainer, r.startOffset)
        r2.setEnd(r.endContainer, r.endOffset)
        const start = r1.toString().length, end = r2.toString().length
        return { kind: 'selection', start, end }
      }
    } else return { kind: 'blur' }
  }

  // Updates document to reflect given caret position/selection state
  const reflectCaretState = (state: CaretState) => {
    const e = localRef.current
    if (e) {
      const sel = window.getSelection()
      if (state.kind === 'caret') {
        const r = document.createRange()
        if (state.pos <= (e.textContent ?? '').length) {
          r.setStart(e, state.pos)
          r.collapse(true)
          sel?.removeAllRanges()
          sel?.addRange(r)
        }
      } else if (state.kind === 'selection') {
        const r = document.createRange()
        r.collapse(false)
        r.setStart(e, state.start)
        r.setEnd(e, state.end)
        sel?.removeAllRanges()
        sel?.addRange(r)
      } else if (state.kind === 'blur') e.blur()
    }
  }

  // Forward content changes to `onChange` handler and sync caret position/selection state
  const handleChange = (ev: ContentEditableEvent) => {
    syncCaretState()

    // Sanitize contenteditable innerText by removing newlines (which sometimes occur when field
    // is empty) and "<" / ">" (which could allow HTML to be injected into page by user).
    const text = ev.currentTarget.innerText.replaceAll(/[<>\n]/g, '')

    // Invoke handler
    onChange(text)
  }

  // Reset button
  const resetable = onReset && !empty(code)
  const doReset = () => {
    setCaretState({ kind: 'caret', pos: 0 })
    onReset && onReset()
  }
  const handleResetClick = (ev: MouseEvent<SVGSVGElement>) => doReset()
  const handleResetTouch = (ev: TouchEvent<SVGSVGElement>) => doReset()

  // Restore caret position/selection state after every re-render
  useEffect(() => reflectCaretState(caretState))

  const errorPos = (error.type === 'parse-error' && !error.ref.incompleteInput) ? error.ref.position : -1
  const codeHtml = code.split('').map((c, i) => `<span class="pos-${i} ${errorPos === i ? 'pos-error' : ''}">${c}</span>`).join('')

  // Workaround for cursor placement oddity in Firefox - introduce empty span if no other content (i.e. `code.length` is zero)
  const html = empty(codeHtml) ? '<span></span>' : codeHtml

  return (
    <div className='code-box-wrapper'>
      <ContentEditable
        className={`code-box ${className}`}
        tagName="pre"
        spellCheck="false"
        html={html} // innerHTML of the editable element
        innerRef={localRef}

        // Handle user input
        onChange={handleChange}

        // Handle enter: dismiss mobile keyboard and/or blur
        onKeyUp={dismissKeyboardOnEnter}

        // Update state to reflect user-initiated caret movement
        onFocusCapture={syncCaretState}
        onKeyDown={syncCaretState}
        onTouchEnd={syncCaretState}
        onMouseUp={syncCaretState}
        onBlur={syncCaretState}
      />

      { onReset ? <FontAwesomeIcon icon={faCircle} /> : <></>}
      { onReset ? <FontAwesomeIcon icon={faCircleXmark} className="reset-button" onMouseUp={handleResetClick} onTouchEnd={handleResetTouch} /> : <></>}
    </div>
  )
})

export default CodeBox