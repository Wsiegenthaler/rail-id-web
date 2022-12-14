import { kebabCase } from 'lodash-es'

import { SetFieldMeta, ValueMeta } from 'rail-id'

import Highlighter from '../../util/highlight/Highlighter'
import { empty } from '../../../util'
import FieldValueBody from './FieldValueBody'
import Markdown from '../../util/Markdown'

type Props = {
  field: SetFieldMeta<any>
}

function SetField({ field }: Props) {

  const friendlyValue = (vm: ValueMeta<any>) => {
    const tpe = typeof vm.value
    if (tpe === 'number' || tpe === 'string') return vm.value
    else return vm.displayValue
  }

  const fieldValues = field.valueMetas.map((vm, i) => (
    <Highlighter values={ [ vm ] } key={i}>
      <div className="field-content">
        <div className="field-value-header">
          <div className="field-value highlight-hint-underline">{friendlyValue(vm)}</div>
        </div>
        <FieldValueBody desc={vm.desc} footnotes={vm.footnotes} />
      </div>
    </Highlighter>
  ))

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { !empty(field.desc) ? <div className="field-desc"><Markdown md={field.desc} /></div> : <></> }
        { fieldValues }
      </div>
    </div>
  )
}

export default SetField