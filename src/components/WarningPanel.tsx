import { values } from 'lodash-es'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { RailID, ParseWarning, ParseWarnings, SetFieldMeta, ValueMeta } from 'rail-id'

import { empty, hashCode, isBenign } from '../util'

import { AppError } from '../App'

import Highlighter from './util/Highlighter'
import HighlightHintDot from './util/HighlightHintDot'

type Props = {
  result?: RailID
  error: AppError
}

function WarningPanel({ result, error }: Props) {
  if (!result || !isBenign(error)) return (<></>)

  const warningField =
    values(result._meta.fields).filter(f => f.path === ParseWarnings.path).pop() as SetFieldMeta<ParseWarning>

  if (!warningField) return (<></>)

  const warning = (w: ValueMeta<ParseWarning>) => (
    <li key={hashCode(w.displayValue)} className="fade-in">
      <span>{w.displayValue}</span>
      <Highlighter values={[ w ]}>
        { !empty(w.source) ? <HighlightHintDot /> : <></> }
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