import { some } from 'lodash-es'

import { SetFieldMeta, ScalarFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../components/FieldRouter'

import ScalarField from './ScalarField'
import SetField from './SetField'


function Field({ field, setHighlights }: FieldElementProps) {
  if (field.type === 'scalar') {
    const scalar = field as ScalarFieldMeta<any>
    const ft = typeof scalar.valueMeta.value
    if (ft !== 'object' || (scalar.valueMeta.readableValue && scalar.valueMeta.readablValue.length > 0)) {
      return (<ScalarField field={field} setHighlights={setHighlights} />)
    } else {
      console.warn(`Could not render '${scalar.name}' field with value of type '${ft}':`, field)
      return (<></>)
    }
  } else {
    const set = field as SetFieldMeta<any>
    const ft = typeof set.valueMetas[0].value
    if (ft !== 'object' || (some(set.valueMetas, vm => vm.readableValue && vm.readableValue.length > 0))) {
      return (<SetField field={field} setHighlights={setHighlights} />)
    } else {
      console.warn(`Could not render '${set.name}' field with value of type '${ft}':`, field)
      return (<></>)
    }
  }
}

export default Field
