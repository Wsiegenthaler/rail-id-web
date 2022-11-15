import { SetFieldMeta, ScalarFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'

import ScalarField from './ScalarField'
import SetField from './SetField'


function Field({ field, setHighlights }: FieldElementProps) {
  if (field.type === 'scalar') {
    const scalar = field as ScalarFieldMeta<any>
    const ft = typeof scalar.valueMeta.value
    if (ft !== 'object') return (<ScalarField field={field} setHighlights={setHighlights} />)
    else return (<div>Could not render '{scalar.name}' field with value of type '{ft}'</div>)
  } else {
    const set = field as SetFieldMeta<any>
    const ft = typeof set.valueMetas[0].value
    if (ft !== 'object') return (<SetField field={field} setHighlights={setHighlights} />)
    else return (<div>Could not render '{set.name}' field with value of type '{ft}'</div>)
  }
}

export default Field
