import { ValueMeta } from 'rail-id'

import HighlightMarker from './HighlightMarker'
import HighlightZone from './HighlightZone'

type Props = {
  values: ValueMeta<any>[]
  children: JSX.Element[] | JSX.Element
}

function Highlighter({ values, children }: Props) {
  return (
    <HighlightMarker values={values}>
      <HighlightZone>
        {children}
      </HighlightZone>
    </HighlightMarker>
  )
}

export default Highlighter