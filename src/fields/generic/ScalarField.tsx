import { kebabCase } from 'lodash-es'

import { ScalarFieldMeta, ValueMeta } from 'rail-id'

import { HighlightState, SetHighlights } from '../../App'

import FieldValueBody from './FieldValueBody'

import Highlighter from '../../components/Highlighter'

type Props = {
  field: ScalarFieldMeta<any>
  highlights: HighlightState
  setHighlights: SetHighlights
}

function ScalarField({ field, highlights, setHighlights }: Props) {

  const friendlyValue = (vm: ValueMeta<any>) => {
    const tpe = typeof vm.value
    if (tpe === 'number' || tpe === 'string') return vm.value
    else return vm.readableValue
  }

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { field.desc && field.desc.length > 0 ? <div className="field-desc">{field.desc}</div> : <></> }
      </div>
      <Highlighter values={[ field.valueMeta ]} highlights={highlights} setHighlights={setHighlights}>
        <div className="field-body">
          <div className="field-value-header">
            <div className="field-value highlight-hint-underline">{friendlyValue(field.valueMeta)}</div>
          </div>
          <FieldValueBody desc={field.valueMeta.desc} footnotes={field.valueMeta.footnotes} />
        </div>
      </Highlighter>
    </div>
  )
}

export default ScalarField