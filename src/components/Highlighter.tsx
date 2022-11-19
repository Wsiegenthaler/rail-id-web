import { useState } from 'react'
import { nanoid } from 'nanoid'

import { ValueMeta } from 'rail-id'

import { HighlightState, SetHighlights } from '../App'

type Props = {
  values: ValueMeta<any>[]
  highlights: HighlightState
  setHighlights: SetHighlights
  children: JSX.Element[] | JSX.Element
}

function Highlighter({ values, highlights, setHighlights, children }: Props) {
  const [uid, setUid] = useState<string>(nanoid())

  const active = highlights !== 'clear' && highlights.origin === uid

  const onMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => set(true)
  const onMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => set(false)
  const toggleTouch = (ev: React.TouchEvent<HTMLDivElement>) => {
    ev.stopPropagation()
    set(!active)
  }

  const set = (to: boolean) => {
    if (to && values.length > 0) {
      const source = values.flatMap(vm => vm.source)
      setHighlights({ origin: uid, source })
    } else setHighlights('clear')
  }

  return (
    <div className={active ? 'highlight' : ''} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTouchStart={toggleTouch} >
      {children}
    </div>
  )
}

export default Highlighter