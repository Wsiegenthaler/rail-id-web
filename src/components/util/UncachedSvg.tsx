import React, { useState } from "react"
import svgToMiniDataUri from 'mini-svg-data-uri'
import { nanoid } from "nanoid"

type Props = { src: string, className?: string }

// Component to prevent caching of svgs. Useful for animated svgs where browser
// will skip animation upon reload from cache.
function UncachedSvg({ src, className }: Props) {
  const [uid, setUid] = useState<string>(nanoid())

  const cacheBust = `<!--${uid}-->`
  const uri = svgToMiniDataUri(cacheBust + src)

  return (<img src={uri} className={className} />)
}

export default UncachedSvg