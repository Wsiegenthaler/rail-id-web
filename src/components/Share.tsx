import { useState, MouseEvent, TouchEvent } from "react"

import { empty, urlEncodeCode } from "../util"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faShare } from '@fortawesome/free-solid-svg-icons'

type LinkProps = {
  code: string
}


function Share({ code }: LinkProps) {

  const [isCopied, setIsCopied] = useState(false)
  const [msg, setMsg] = useState<string>('')

  const loc = window.location
  const clean = (code ?? '').replaceAll(/\s+/g, ' ').trim()
  const href = loc.origin + loc.pathname + `?c=${urlEncodeCode(clean)}`

  const shareData = {
    title: `Rail ID`,
    text: `Rail ID [${clean}]`,
    url: href
  }
  const canShare = ('canShare' in navigator) && navigator.canShare(shareData)

  const doCopy = (text: string, btn: HTMLButtonElement) => {
    setMsg('')
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setMsg('Copied to clipboard!')
          btn.blur()
      })
    }
  }

  const doShare = (btn: HTMLButtonElement) => {
    if ('share' in navigator) {
      navigator.share(shareData)
        .then(() => {
          setMsg('Success!')
          btn.blur()
        })
    }
  }

  const onMouseCopy = (ev: MouseEvent<HTMLButtonElement>) => doCopy(href, ev.currentTarget)
  const onTouchCopy = (ev: TouchEvent<HTMLButtonElement>) => doCopy(href, ev.currentTarget)
  const onMouseShare = (ev: MouseEvent<HTMLButtonElement>) => doShare(ev.currentTarget)
  const onTouchShare = (ev: TouchEvent<HTMLButtonElement>) => doShare(ev.currentTarget)

  const copyButton = !empty(clean) ? (
    <button className="copy-url" onMouseUp={onMouseCopy} onTouchEnd={onTouchCopy}>
      <FontAwesomeIcon icon={faCopy} />
      Copy link
     </button>) : (<></>)

  const shareButton = !empty(clean) && canShare ? (
    <button className="share" onMouseUp={onMouseShare} onTouchEnd={onTouchShare}>
      <FontAwesomeIcon icon={faShare} />
      Share
    </button>) : (<></>)

  const shareables = !empty(clean) ?
    (<div className="shareables">
      <div className="shareables-title">Share this code:</div>
      <div className="shareables-code">{clean}</div>
      <div className="buttons">
        { shareButton }
        { copyButton }
      </div>
      { !empty(msg) ? <div className="msg slow-fade-out">{msg}</div> : <></> }
    </div>) : (<></>)

  return shareables
}

export default Share