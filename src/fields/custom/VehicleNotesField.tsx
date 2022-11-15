import { SetFieldMeta } from 'rail-id'
import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'


//TODO
function VehicleNotesField({ field, setHighlights }: FieldElementProps) {

  const noteField = field as SetFieldMeta<string>

  const listItems = noteField.valueMetas.map(vm => (
    <li>
      <Highlighter values={[ vm ]} setHighlights={setHighlights}>
        <span>{ vm.value }</span>
      </Highlighter>
    </li>
    ))

  return (
    <div className="field vehicle-notes">
      <div className="field-header">
        <div className="field-name">{field.name}</div>
      </div>
      <div className="field-body">
        <ul>
          { listItems }
        </ul>
      </div>
    </div>)
}

export default VehicleNotesField
