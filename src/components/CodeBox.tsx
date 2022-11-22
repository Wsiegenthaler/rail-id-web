import {
  useEffect,
  useState,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  forwardRef,
  ForwardedRef,
  useRef,
  Ref,
  MutableRefObject
} from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faSquareXmark } from '@fortawesome/free-solid-svg-icons'

import { AppError } from '../App'

type Props = {
  code: string
  onChange: (code: string) => void
  error: AppError
  className?: string
  onReset?: () => void
}

const sanitize = (html: string) => sanitizeHtml(html, { disallowedTagsMode: 'discard', allowedTags: [], allowedAttributes: {} })

function dismissKeyboardOnEnter(ev: KeyboardEvent<HTMLElement>) {
  const key = ev.code ?? ev.keyCode.toString()
  if (key === 'Enter' || key === '13') ev.currentTarget.blur()
}

function getCaretCharacterOffsetWithin(el: Node) {
  var caretOffset = 0
  var doc = el.ownerDocument!
  var win = doc.defaultView!
  var sel
  if (typeof win.getSelection != 'undefined') {
    sel = win.getSelection()
    if (sel!.rangeCount > 0) {
      var range = win.getSelection()!.getRangeAt(0)
      var preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(el)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    }
  }
  return caretOffset
}

function setCaretPos(el: Node, pos: number) {
  var range = document.createRange()
  var sel = window.getSelection()
 
  if (pos <= (el.textContent ?? '').length) {
    range.setStart(el, pos)
    range.collapse(true)
  
    sel!.removeAllRanges()
    sel!.addRange(range)
  }
}

const CodeBox = forwardRef(({ code, onChange, error, onReset, className = '' }: Props, forwardRef: ForwardedRef<HTMLElement>) => {
  const [caret, setCaret] = useState(0)

  const localRef = useRef<HTMLElement | null>(null)

  // Handle content changes
  const handleChange = (ev: ContentEditableEvent) => {
    const newCaret = getCaretCharacterOffsetWithin(localRef.current!)
    setCaret(newCaret)

    onChange(sanitize(ev.target.value))
  }

  // Reset button
  const resetable = onReset && code.trim().length > 0
  const resetBtnClass = `reset-button ${resetable ? 'resetable' : ''}`
  const doReset = () => {
    localRef?.current?.focus()
    onReset && onReset()
  }
  const handleResetClick = (ev: MouseEvent<SVGSVGElement>) => doReset()
  const handleResetTouch = (ev: TouchEvent<SVGSVGElement>) => doReset()

  // Restore caret position after re-render
  useEffect(() => setCaretPos(localRef.current!, caret))

  const errorPos = (error.type === 'parse-error' && !error.ref.incompleteInput) ? error.ref.position : -1
  const html = code.split('').map((c, i) => `<span class="pos-${i} ${errorPos === i ? 'pos-error' : ''}">${c}</span>`).join('')

  return (
    <div className='code-box-wrapper'>
      <ContentEditable
        className={`code-box ${className}`}
        tagName="pre"
        spellCheck="false"
        placeholder='Enter vehicle marking...'
        html={html} // innerHTML of the editable div
        onChange={handleChange} // handle innerHTML change
        onKeyUp={dismissKeyboardOnEnter}
        innerRef={assignRefs(localRef, forwardRef)} />

      { onReset ? <FontAwesomeIcon icon={faSquare} /> : <></>}
      { onReset ? <FontAwesomeIcon icon={faSquareXmark} className={resetBtnClass} onMouseUp={handleResetClick} onTouchEnd={handleResetTouch} /> : <></>}
    </div>
  )
})

// Awkward solution to bind both local ref and forwarded ref to same child element ref prop.
// See: https://stackoverflow.com/questions/62238716/using-ref-current-in-react-forwardref
const assignRefs = <T extends unknown>(...refs: Ref<T | null>[]) => {
  return (node: T | null) => {
    refs.forEach(r => {
      if (typeof r === "function") {
        r(node)
      } else if (r) {
        (r as MutableRefObject<T | null>).current = node
      }
    })
  }
}

export default CodeBox