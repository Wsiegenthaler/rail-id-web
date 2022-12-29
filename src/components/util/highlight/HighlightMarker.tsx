import { createContext, useContext, useState } from 'react'
import { nanoid } from 'nanoid'

import { ValueMeta } from 'rail-id'

import { HighlightContext } from '../../../App'

type Props = {
  values: ValueMeta<any>[]
  children: JSX.Element[] | JSX.Element
}

type HighlightMarkerContextType = { markerId: string, values: ValueMeta<any>[] }

export const HighlightMarkerContext = createContext<HighlightMarkerContextType | 'none'>('none')

function HighlightMarker({ values, children }: Props) {
  const ctx = useContext(HighlightContext)
  const [id, setId] = useState<string>(nanoid())
  const active = ctx && ctx.state !== 'clear' && ctx.state.markerId === id

  return (
    <span className={active ? 'highlight' : ''}>
      <HighlightMarkerContext.Provider value={({ markerId: id, values })}>
        {children}
      </HighlightMarkerContext.Provider>
    </span>
  )
}

export default HighlightMarker