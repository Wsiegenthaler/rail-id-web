import { SetFieldMeta, ValueMeta } from 'rail-id'

import { SetHighlights } from '../../App'

import Highlighter from '../../components/Highlighter'
import FieldValueBody from './FieldValueBody'

type Props = {
  field: SetFieldMeta<any>
  setHighlights: SetHighlights
}

function SetField({ field, setHighlights }: Props) {

  const fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  const friendlyValue = (vm: ValueMeta<any>) => {
    const tpe = typeof vm.value
    if (tpe === 'number' || tpe === 'string') return vm.value
    else return vm.readableValue
  }

  const fieldValues = field.valueMetas.map((vm, i) => (
    <Highlighter values={field.valueMetas} setHighlights={setHighlights} key={i}>
      <div className="field-body">
        <div className="field-value-header">
          <div className="field-value highlight-hint-underline">{friendlyValue(vm)}</div>
        </div>
        <FieldValueBody desc={vm.desc} footnotes={vm.footnotes} />
      </div>
    </Highlighter>
  ))

  return (
    <div className={fieldClasses}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        <div className="field-desc">{field.desc}</div>
        { fieldValues }
      </div>
    </div>
  )
}

export default SetField