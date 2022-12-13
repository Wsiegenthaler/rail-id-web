import { useState } from "react"
import { nanoid } from "nanoid"

import { Buffer } from 'buffer'

type Props = { src: string, className?: string }

const encode64 = (str: string) => Buffer.from(str, 'binary').toString('base64')

// Component which prevents browser caching of svgs which sometimes
// results in failure to execute any embedded animations.
function UncachedSvg({ src, className }: Props) {
  const [uid, setUid] = useState<string>(nanoid())

  const cacheBust = `<!--${uid}-->`
  const uri = `data:image/svg+xml;base64,${encode64((cacheBust + src))}`

  return (<img src={uri} className={className} />)
}

export default UncachedSvg