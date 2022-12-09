import { useState, MouseEvent, TouchEvent, useEffect } from "react"

import { empty, urlEncodeCode } from "../util"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faShare } from '@fortawesome/free-solid-svg-icons'

type LinkProps = {
  code: string
}


function Share({ code }: LinkProps) {

  const msgDelay = 3000

  const [didCopy, setDidCopy] = useState<boolean>(false)
  const [didShare, setDidShare] = useState<boolean>(false)

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
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setDidCopy(true)
          btn.blur()
      })
    }
  }
  useEffect(() => { if (didCopy) setTimeout(() => setDidCopy(false), msgDelay) }, [ didCopy ])

  const doShare = (btn: HTMLButtonElement) => {
    if ('share' in navigator) {
      navigator.share(shareData)
        .then(() => {
          setDidShare(true)
          btn.blur()
        })
    }
  }
  useEffect(() => { if (didShare) setTimeout(() => setDidShare(false), msgDelay) }, [ didShare ])

  const onMouseCopy = (ev: MouseEvent<HTMLButtonElement>) => doCopy(href, ev.currentTarget)
  const onTouchCopy = (ev: TouchEvent<HTMLButtonElement>) => doCopy(href, ev.currentTarget)
  const onMouseShare = (ev: MouseEvent<HTMLButtonElement>) => doShare(ev.currentTarget)
  const onTouchShare = (ev: TouchEvent<HTMLButtonElement>) => doShare(ev.currentTarget)

  const copyButton = !empty(clean) ? (
    <button className="copy-url" disabled={didCopy} onMouseUp={onMouseCopy} onTouchEnd={onTouchCopy}>
      <FontAwesomeIcon icon={faCopy} />
      { didCopy ? 'Copied!' : 'Copy link' }
     </button>) : (<></>)

  const shareButton = !empty(clean) && canShare ? (
    <button className="share" disabled={didShare} onMouseUp={onMouseShare} onTouchEnd={onTouchShare}>
      <FontAwesomeIcon icon={faShare} />
      { didShare ? 'Shared!' : 'Share' }
    </button>) : (<></>)

  const shareables = !empty(clean) ?
    (<div className="shareables">
      <div className="shareables-title">Share this code:</div>
      <div className="shareables-code">{clean}</div>
      <div className="buttons">
        { shareButton }
        { copyButton }
      </div>
    </div>) : (<></>)

  return shareables
}

export default Share