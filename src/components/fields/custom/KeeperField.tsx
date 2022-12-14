import { kebabCase } from 'lodash-es'

import { KeeperDef, ScalarFieldMeta } from 'rail-id'

import FieldValueBody from '../generic/FieldValueBody'
import { FieldElementProps } from '../../FieldRouter'
import Highlighter from '../../util/highlight/Highlighter'

import { empty } from '../../../util'
import Markdown from '../../util/Markdown'


function GenericScalarField({ field }: FieldElementProps) {

  let scalar = field as ScalarFieldMeta<KeeperDef>
  let keeper: KeeperDef = scalar.valueMeta.value
 
  const footnotes = [
    scalar.valueMeta.footnotes,
    keeper.otif ? [`This company is listed as OTIF compliant`] : [],
    keeper.status === 'blocked' || keeper.status === 'revoked' ? [`This keeper marking is listed as "${keeper.status}" by the International Union of Railways`] : [],
    keeper.website ? [`Website: [${keeper.company}](${keeper.website})`] : []
  ].flat()

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { !empty(field.desc) ? <div className="field-desc"><Markdown md={field.desc} /></div> : <></> }
      </div>
      <Highlighter values={[ scalar.valueMeta ]}>
        <div className="field-content">
          <div className="field-value-header">
            <div className="field-value highlight-hint-underline">{keeper.company}</div>
          </div>
          <FieldValueBody desc={scalar.valueMeta.desc} footnotes={footnotes} />
        </div>
      </Highlighter>
    </div>
  )
}

export default GenericScalarField
