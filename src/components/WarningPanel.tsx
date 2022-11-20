import { values } from 'lodash-es'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { RailID, ParseWarning, ParseWarnings, SetFieldMeta, ValueMeta } from 'rail-id'

import { hashCode } from '../util'

import { AppError, HighlightState, SetHighlights } from '../App'

import Highlighter from './Highlighter'
import HighlightHintDot from './util/HighlightHintDot'

type Props = {
  result?: RailID
  error: AppError
  highlights: HighlightState
  setHighlights: SetHighlights
}

function WarningPanel({ result, error, highlights, setHighlights }: Props) {
  if (!result || error.type !== 'none') return (<></>)

  const warningField =
    values(result._meta.fields).filter(f => f.path === ParseWarnings.path).pop() as SetFieldMeta<ParseWarning>

  if (!warningField) return (<></>)

  const warning = (w: ValueMeta<ParseWarning>) => (
    <li key={hashCode(w.readableValue)} className="fade-in">
      <span>{w.readableValue}</span>
      <Highlighter highlights={highlights} setHighlights={setHighlights} values={[ w ]}>
        { w.source.length > 0 ? <HighlightHintDot /> : <></> }
      </Highlighter>
    </li>)

  const warnings = (vms: ValueMeta<ParseWarning>[]) => vms.map(warning)

  return (
    <div className="warning-msg fade-in">
      <div className="warn-icon">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <ul>{warnings(warningField.valueMetas)}</ul>
    </div>)
}

export default WarningPanel