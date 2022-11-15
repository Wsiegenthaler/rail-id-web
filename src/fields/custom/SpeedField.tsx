import { ScalarFieldMeta, SpeedRange } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import FieldValueBody from '../generic/FieldValueBody'


function SpeedsField({ field, setHighlights }: FieldElementProps) {

  const speedField = field as ScalarFieldMeta<SpeedRange>
  const fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  const speedRangeDesc = (s: SpeedRange) => {
    if (s.min && s.max) return `${s.min} to ${s.max} ${s.unit}`
    if (!s.min) return `Up to ${s.max} ${s.unit}`
    if (!s.max) return `${s.min} ${s.unit} and over`
  }

  return (
    <div className={fieldClasses}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
          <Highlighter values={[ speedField.valueMeta ]} setHighlights={setHighlights}>
            <div className="field-body">
              <div className="field-value-header">
                <div className="field-value">{speedRangeDesc(speedField.valueMeta.value)}</div>
              </div>
              <FieldValueBody desc={speedField.valueMeta.desc} footnotes={speedField.valueMeta.footnotes} />
            </div>
          </Highlighter>
      </div>
    </div>
  )
}

export default SpeedsField
