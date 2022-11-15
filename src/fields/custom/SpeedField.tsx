import { ScalarFieldMeta, SpeedRange } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import FieldValueBody from '../generic/FieldValueBody'


function SpeedsField({ field, setHighlights }: FieldElementProps) {

  const speedField = field as ScalarFieldMeta<SpeedRange>
  const fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  return (
    <div className={fieldClasses}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
          <Highlighter values={[ speedField.valueMeta ]} setHighlights={setHighlights}>
            <div className="field-body">
              <div className="field-value-header">
                <div className="field-value">{speedField.valueMeta.readableValue}</div>
              </div>
              <FieldValueBody desc={speedField.valueMeta.desc} footnotes={speedField.valueMeta.footnotes} />
            </div>
          </Highlighter>
      </div>
    </div>
  )
}

export default SpeedsField
