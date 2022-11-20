import { KeeperDef, ScalarFieldMeta } from 'rail-id'

import FieldValueBody from '../generic/FieldValueBody'
import { FieldElementProps } from '../../components/FieldRouter'
import Highlighter from '../../components/Highlighter'
import Link from '../../components/util/Link'


function GenericScalarField({ field, highlights, setHighlights }: FieldElementProps) {

  let scalar = field as ScalarFieldMeta<KeeperDef>
  let keeper = scalar.valueMeta.value
 
  const footnotes = [
    scalar.valueMeta.footnotes,
    keeper.otif ? [`This company is listed as OTIF compliant`] : [],
    keeper.status === 'blocked' || keeper.status === 'revoked' ? [`This keeper marking is listed as "${keeper.status}" by the International Union of Railways`] : [],
  ].flat()

  let fieldClasses = `field ${field.path.replaceAll(/\./g, '-')}`
 
  const link = !keeper.website ? (<></>) :
    (<span>&nbsp;[<Link href={keeper.website} className="external">web</Link>]</span>)

  return (
    <div className={fieldClasses}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
        { field.desc && field.desc.length > 0 ? <div className="field-desc">{field.desc}</div> : <></> }
      </div>
      <Highlighter values={[ scalar.valueMeta ]} highlights={highlights} setHighlights={setHighlights}>
        <div className="field-body">
          <div className="field-value-header">
            <div className="field-value highlight-hint-underline">{keeper.company}{link}</div>
          </div>
          <FieldValueBody desc={scalar.valueMeta.desc} footnotes={footnotes} />
        </div>
      </Highlighter>
    </div>
  )
}

export default GenericScalarField
