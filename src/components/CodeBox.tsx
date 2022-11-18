import { createRef, useEffect, useState } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'
import { AppError } from '../App'

type Props = {
  code: string
  onChange: (code: string) => void
  error: AppError
}

export default CodeBox


const sanitize = (html: string) => sanitizeHtml(html, { disallowedTagsMode: 'discard', allowedTags: [], allowedAttributes: {} })

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
    //} else if ((sel = doc.selection) && sel.type != 'Control') {
    //  var textRange = sel.createRange()
    //  var preCaretTextRange = doc.body.createTextRange()
    //  preCaretTextRange.moveToElementText(el)
    //  preCaretTextRange.setEndPoint('EndToEnd', textRange)
    //  caretOffset = preCaretTextRange.text.length
    }
    return caretOffset
  }

  
  function setCaretPos(el: Node, pos: number) {
      var range = document.createRange()
      var sel = window.getSelection()
      
      range.setStart(el, pos)
      range.collapse(true)
      
      sel!.removeAllRanges()
      sel!.addRange(range)
  }

function CodeBox({ code, onChange, error }: Props) {
  const [caret, setCaret] = useState(0)

  const innerRef = createRef<HTMLElement>()

  const handleChange = (ev: ContentEditableEvent) => {
    const newCaret = getCaretCharacterOffsetWithin(innerRef.current!)
    setCaret(newCaret)

    onChange(sanitize(ev.target.value))
  }

  useEffect(() => setCaretPos(innerRef.current!, caret))

  const errorPos = (error.type === 'parse-error') ? error.ref.position : -1
  const html = code.split('').map((c, i) => `<span class="pos-${i} ${errorPos === i ? 'pos-error' : ''}">${c}</span>`).join('')

  return (
    <div className='code-box-wrapper columns is-centered'>
      <div className='column is-9-fullhd is-10-widescreen is-11-desktop is-11-tablet is-12-mobile'>
        <ContentEditable
          className="code-box"
          tagName="pre"
          spellCheck="false"
          placeholder='Enter vehicle marking...'
          html={html} // innerHTML of the editable div
          onChange={handleChange} // handle innerHTML change
          innerRef={innerRef} />
      </div>
    </div>
  )
}