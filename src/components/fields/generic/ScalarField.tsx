import { kebabCase } from 'lodash-es'

import { ScalarFieldMeta, ValueMeta } from 'rail-id'

import FieldValueBody from './FieldValueBody'

import Highlighter from '../../util/highlight/Highlighter'

import { empty } from '../../../util'
import Markdown from '../../util/Markdown'

type Props = {
  field: ScalarFieldMeta<any>
}

function ScalarField({ field }: Props) {

  const friendlyValue = (vm: ValueMeta<any>) => {
    const tpe = typeof vm.value
    if (tpe === 'number' || tpe === 'string') return vm.value
    else return vm.displayValue
  }

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { !empty(field.desc) ? <div className="field-desc"><Markdown md={field.desc} /></div> : <></> }
      </div>
      <Highlighter values={[ field.valueMeta ]}>
        <div className="field-content">
          <div className="field-value-header">
            <div className="field-value highlight-hint-underline">{friendlyValue(field.valueMeta)}</div>
          </div>
          <FieldValueBody desc={field.valueMeta.desc} footnotes={field.valueMeta.footnotes} />
        </div>
      </Highlighter>
    </div>
  )
}

export default ScalarField