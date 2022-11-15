import { range } from 'lodash-es'

import { ValueMeta } from 'rail-id'
import { useState } from 'react'
import { SetHighlights } from '../RailIDApp'

type Props = {
  values: ValueMeta<any>[]
  setHighlights: SetHighlights
  children: JSX.Element[] | JSX.Element
}

function Highlighter({ values, setHighlights, children }: Props) {
  const [highlightActive, setHighlightActive] = useState(false)

  const highlight = (active: boolean) => () => {
    setHighlightActive(active)
    if (active && values.length > 0) {
      const highlights = values.filter(vm => vm.source).flatMap(vm => range(vm.source!.start, vm.source!.end))
      setHighlights(highlights)
    } else setHighlights([])
  }

  return (
    <div className={highlightActive ? 'highlight' : ''} onMouseEnter={highlight(true)} onMouseLeave={highlight(false)} onTouchStart={highlight(true)}>
      {children}
    </div>
  )
}

export default Highlighter