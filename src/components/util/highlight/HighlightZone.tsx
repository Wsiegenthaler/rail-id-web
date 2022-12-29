import { MouseEvent, TouchEvent, useContext } from 'react'

import { HighlightContext } from '../../../App'
import { HighlightMarkerContext } from './HighlightMarker'

type Props = {
  children: JSX.Element[] | JSX.Element
}

function HighlightZone({ children }: Props) {
  const ctx = useContext(HighlightContext)
  const markerCtx = useContext(HighlightMarkerContext)

  const markerId = markerCtx === 'none' ? null : markerCtx.markerId

  const values = markerCtx === 'none' ? [] : markerCtx.values
  const active = ctx && ctx.state !== 'clear' && ctx.state.markerId === markerId

  const onMouseEnter = (ev: MouseEvent<HTMLSpanElement>) => set(true)
  const onMouseLeave = (ev: MouseEvent<HTMLSpanElement>) => set(false)
  const toggleTouch = (ev: TouchEvent<HTMLSpanElement>) => {
    ev.stopPropagation()
    set(!active)
  }

  const set = (to: boolean) => {
    if (!ctx) return

    if (to && values.length > 0) {
      const source = values.flatMap(vm => vm.source)
      ctx.set(markerId ? { markerId, source } : 'clear')
    } else ctx.set('clear')
  }

  return (
    <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTouchStart={toggleTouch} >
      {children}
    </span>
  )
}

export default HighlightZone