import { values } from 'lodash-es'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

import { RailID, ParseWarnings, SetFieldMeta, ValueMeta } from 'rail-id'

import Highlighter from './Highlighter'
import { SetHighlights } from '../RailIDApp'
import { hashCode } from '../util'

type Props = {
  result?: RailID
  setHighlights: SetHighlights
}

function WarningPanel({ result, setHighlights }: Props) {
  if (!result) return (<></>)

  const warningField = values(result._meta.fields).filter(f => f.path === ParseWarnings.path).pop() as SetFieldMeta<string> | undefined
  if (!warningField) return (<></>)

  const warningInfo = (w: ValueMeta<string>) => w.source ? (<FontAwesomeIcon icon={faCircleInfo} />) : (<></>)

  const warning = (w: ValueMeta<string>) => (
    <li key={hashCode(w.value)}>
      <Highlighter setHighlights={setHighlights} values={[ w ]}>
        <span>{w.value}</span>
        {warningInfo(w)}
      </Highlighter>
    </li>)

  const warnings = (vms: ValueMeta<string>[]) => vms.map(warning)

  return (
    <div className="warnings">
      <div className="gutter">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <ul>{warnings(warningField.valueMetas)}</ul>
    </div>)
}

export default WarningPanel