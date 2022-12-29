import { MouseEvent, TouchEvent, useContext, useState } from 'react'
import { nanoid } from 'nanoid'

import { ValueMeta } from 'rail-id'

import { HighlightContext } from '../../App'

type Props = {
  values: ValueMeta<any>[]
  children: JSX.Element[] | JSX.Element
}

function Highlighter({ values, children }: Props) {
  const context = useContext(HighlightContext)

  const [uid, setUid] = useState<string>(nanoid())

  const active = context && context.state !== 'clear' && context.state.markerId === uid

  const onMouseEnter = (ev: MouseEvent<HTMLSpanElement>) => set(true)
  const onMouseLeave = (ev: MouseEvent<HTMLSpanElement>) => set(false)
  const toggleTouch = (ev: TouchEvent<HTMLSpanElement>) => {
    ev.stopPropagation()
    set(!active)
  }

  const set = (to: boolean) => {
    if (!context) return

    if (to && values.length > 0) {
      const source = values.flatMap(vm => vm.source)
      context.set({ markerId: uid, source })
    } else context.set('clear')
  }

  return (
    <span className={active ? 'highlight' : ''} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTouchStart={toggleTouch} >
      {children}
    </span>
  )
}

export default Highlighter