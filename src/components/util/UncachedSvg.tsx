import { useState } from "react"
import svgToMiniDataUri from 'mini-svg-data-uri'
import { nanoid } from "nanoid"

type Props = { src: string, className?: string }

// Component which prevents caching of svgs by the browser which sometimes
// results in failure to execute any embedded animations.
function UncachedSvg({ src, className }: Props) {
  const [uid, setUid] = useState<string>(nanoid())

  const cacheBust = `<!--${uid}-->`
  const uri = svgToMiniDataUri(cacheBust + src)

  return (<img src={uri} className={className} />)
}

export default UncachedSvg