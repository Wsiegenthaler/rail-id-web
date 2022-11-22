import { useState, MouseEvent, TouchEvent } from "react"

type LinkProps = {
  code: string
}


function Share({ code }: LinkProps) {

  const [isCopied, setIsCopied] = useState(false)
  const [msg, setMsg] = useState<string>('')

  const loc = window.location
  const clean = (code ?? '').replaceAll(/\s+/g, ' ').trim()
  const href = loc.origin + loc.pathname + `?code=${encodeURIComponent(clean)}`

  const shareData = {
    title: `Rail ID`,
    text: `Rail ID [${clean}]`,
    url: href
  }
  const canShare = ('canShare' in navigator) && navigator.canShare(shareData)

  const doCopy = (text: string) => {
    setMsg('')
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(text)
        .then(() => setMsg('Copied to clipboard!'))
    }
  }

  const doShare = () => ('share' in navigator) && navigator.share(shareData)

  const onMouseCopy = (ev: MouseEvent<HTMLButtonElement>) => doCopy(href)
  const onTouchCopy = (ev: TouchEvent<HTMLButtonElement>) => doCopy(href)
  const onMouseShare = (ev: MouseEvent<HTMLButtonElement>) => doShare()
  const onTouchShare = (ev: TouchEvent<HTMLButtonElement>) => doShare()

  const copyButton = clean.length > 0 ?
    (<button className="copy-url" onMouseUp={onMouseCopy} onTouchEnd={onTouchCopy}>Copy link</button>) : (<></>)

  const shareButton = clean.length > 0 && canShare ?
    (<button className="share" onMouseUp={onMouseShare} onTouchEnd={onTouchShare}>Share</button>) : (<></>)

  const shareables = clean.length > 0 ?
    (<div className="shareables">
      <div className="shareables-title">Share this code</div>
      <div className="buttons">
        { shareButton }
        { copyButton }
      </div>
      { msg.length > 0 ? <div className="msg slow-fade-out">{msg}</div> : <></> }
    </div>) : (<></>)

  return shareables
}

export default Share