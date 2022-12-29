import { kebabCase } from 'lodash-es'

import { SetFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../FieldRouter'
import HighlightHintDot from '../../util/highlight/HighlightHintDot'

import { empty, hashCode } from '../../../util'
import Markdown from '../../util/Markdown'
import HighlightMarker from '../../util/highlight/HighlightMarker'


function OtherNotesField({ field }: FieldElementProps) {

  const noteField = field as SetFieldMeta<string>

  const listItems = noteField.valueMetas.map(vm => (
    <HighlightMarker values={[ vm ]} key={hashCode(vm.displayValue)}>
      <div className="field-content">
        <div className="field-value-body">
          <div className="field-value-desc">
            <Markdown md={ vm.value } />
            <HighlightHintDot />
          </div>
        </div>
      </div>
    </HighlightMarker>
  ))

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { !empty(field.desc) ? <div className="field-desc"><Markdown md={field.desc} /></div> : <></> }
      </div>
      { listItems }
    </div>)
}

export default OtherNotesField
