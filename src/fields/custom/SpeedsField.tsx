import { sortBy } from 'lodash-es'

import { SetFieldMeta, SpeedRange } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import FieldValueBody from '../generic/FieldValueBody'


function SpeedsField({ field, setHighlights }: FieldElementProps) {

  const speedField = field as SetFieldMeta<SpeedRange>
  const fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  const speedRangeDesc = (s: SpeedRange) => {
    if (s.min && s.max) return `${s.min} to ${s.max} ${s.unit}`
    if (!s.min) return `Up to ${s.max} ${s.unit}`
    if (!s.max) return `${s.min} ${s.unit} and over`
  }

  const fieldValues = sortBy(speedField.valueMetas, vm => vm.value.min ?? vm.value.max)
    .map((vm, i) => (
      <Highlighter values={speedField.valueMetas} setHighlights={setHighlights} key={i}>
        <div className="field-body">
          <div className="field-value-header">
            <div className="field-value">{speedRangeDesc(vm.value)}</div>
          </div>
          <FieldValueBody desc={vm.desc} footnotes={vm.footnotes} />
        </div>
      </Highlighter>
    ))

  return (
    <Highlighter values={speedField.valueMetas} setHighlights={setHighlights}>
      <div className={fieldClasses}>
        <div className="field-header">
          <div className="field-name">{field.name}</div>
          { fieldValues }
        </div>
      </div>
    </Highlighter>
  )
}

export default SpeedsField
