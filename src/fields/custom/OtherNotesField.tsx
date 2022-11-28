import { kebabCase } from 'lodash-es'

import { SetFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import HighlightHintDot from '../../components/util/HighlightHintDot'

import { empty, hashCode } from '../../util'


function OtherNotesField({ field, highlights, setHighlights }: FieldElementProps) {

  const noteField = field as SetFieldMeta<string>

  const listItems = noteField.valueMetas.map(vm => (
      <div key={hashCode(vm.displayValue)} className="field-body">
        <div className="field-value-body">
          <div className="field-value-desc">
              { vm.value }
              <Highlighter values={[ vm ]} highlights={highlights} setHighlights={setHighlights} key={vm.value}>
                <HighlightHintDot />
              </Highlighter>
          </div>
        </div>
      </div>
    ))

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { !empty(field.desc) ? <div className="field-desc">{field.desc}</div> : <></> }
      </div>
      { listItems }
    </div>)
}

export default OtherNotesField
