import { SetFieldMeta } from 'rail-id'
import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'


//TODO
function VehicleNotesField({ field, setHighlights }: FieldElementProps) {

  const noteField = field as SetFieldMeta<string>

  const listItems = noteField.valueMetas.map(vm => (
    <Highlighter values={[ vm ]} setHighlights={setHighlights}>
      <div className="field-body">
        <div className="field-value-body">
          <div className="field-desc">
              { vm.value }
          </div>
        </div>
      </div>
    </Highlighter>))

  return (
    <div className="field vehicle-notes">
      <div className="field-header">
        <div className="field-name">{field.name}</div>
      </div>
      { listItems }
    </div>)
}

export default VehicleNotesField
