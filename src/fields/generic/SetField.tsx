import { SetFieldMeta } from 'rail-id'

import { SetHighlights } from '../../App'

import Highlighter from '../../components/Highlighter'
import FieldValueBody from './FieldValueBody'

type Props = {
  field: SetFieldMeta<any>
  setHighlights: SetHighlights
}

function SetField({ field, setHighlights }: Props) {

  const fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  const fieldValues = field.valueMetas.map((vm, i) => (
    <Highlighter values={field.valueMetas} setHighlights={setHighlights} key={i}>
      <div className="field-body">
        <div className="field-value-header">
          <div className="field-value">{vm.value}</div>
        </div>
        <FieldValueBody desc={vm.desc} footnotes={vm.footnotes} />
      </div>
    </Highlighter>
  ))

  return (
    <Highlighter values={field.valueMetas} setHighlights={setHighlights}>
      <div className={fieldClasses}>
        <div className="field-header">
          <div className="field-name">{field.name}</div>
          { fieldValues }
        </div>
      </div>
    </Highlighter>
  )
}

export default SetField