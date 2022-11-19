import { SetFieldMeta } from 'rail-id'
import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import HighlightHintDot from '../../components/util/HighlightHintDot'


function VehicleNotesField({ field, setHighlights }: FieldElementProps) {

  const noteField = field as SetFieldMeta<string>

  const listItems = noteField.valueMetas.map(vm => (
    <Highlighter values={[ vm ]} setHighlights={setHighlights} key={vm.value}>
      <div className="field-body">
        <div className="field-value-body">
          <div className="field-value-desc">
              { vm.value }
              <HighlightHintDot />
          </div>
        </div>
      </div>
    </Highlighter>))

  return (
    <div className="field vehicle-notes">
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        <div className="field-desc">{field.desc}</div>
      </div>
      { listItems }
    </div>)
}

export default VehicleNotesField
