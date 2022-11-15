import { values } from 'lodash-es'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

import { RailID, ParseWarning, ParseWarnings, SetFieldMeta, ValueMeta } from 'rail-id'

import Highlighter from './Highlighter'
import { SetHighlights } from '../App'
import { hashCode } from '../util'

type Props = {
  result?: RailID
  setHighlights: SetHighlights
}

function WarningPanel({ result, setHighlights }: Props) {
  if (!result) return (<></>)

  const warningField: SetFieldMeta<ParseWarning> =
    values(result._meta.fields).filter(f => f.path === ParseWarnings.path).pop()

  if (!warningField) return (<></>)

  const warningInfoIcon = (w: ValueMeta<ParseWarning>) => w.source.length > 0 ? (<FontAwesomeIcon icon={faCircleInfo} />) : (<></>)

  const warning = (w: ValueMeta<ParseWarning>) => (
    <li key={hashCode(w.readableValue)}>
      <Highlighter setHighlights={setHighlights} values={[ w ]}>
        <span>{w.readableValue}</span>
        {warningInfoIcon(w)}
      </Highlighter>
    </li>)

  const warnings = (vms: ValueMeta<ParseWarning>[]) => vms.map(warning)

  return (
    <div className="warnings">
      <div className="gutter">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <ul>{warnings(warningField.valueMetas)}</ul>
    </div>)
}

export default WarningPanel