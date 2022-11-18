import { ScalarFieldMeta, ValueMeta } from 'rail-id'

import { SetHighlights } from '../../App'

import FieldValueBody from './FieldValueBody'

import Highlighter from '../../components/Highlighter'

type Props = {
  field: ScalarFieldMeta<any>
  setHighlights: SetHighlights
}

function ScalarField({ field, setHighlights }: Props) {

  let fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`

  const fieldValue = (vm: ValueMeta<any>) => {
    const tpe = typeof vm.value
    if (tpe === 'number' || tpe === 'string') return vm.value
    else return vm.readableValue
  }

  return (
    <div className={fieldClasses}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        <div className="field-desc">{field.desc}</div>
      </div>
      <Highlighter values={[ field.valueMeta ]} setHighlights={setHighlights}>
        <div className="field-body">
          <div className="field-value-header">
            <div className="field-value">{fieldValue(field.valueMeta)}</div>
          </div>
          <FieldValueBody desc={field.valueMeta.desc} footnotes={field.valueMeta.footnotes} />
        </div>
      </Highlighter>
    </div>
  )
}

export default ScalarField