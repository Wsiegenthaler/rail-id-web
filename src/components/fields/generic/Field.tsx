import { some } from 'lodash-es'

import { SetFieldMeta, ScalarFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../FieldRouter'
import { empty } from '../../../util'
import ScalarField from './ScalarField'
import SetField from './SetField'


function Field({ field, highlights, setHighlights }: FieldElementProps) {
  if (field.type === 'scalar') {
    const scalar = field as ScalarFieldMeta<any>
    const ft = typeof scalar.valueMeta.value
    if (ft !== 'object' || !empty(scalar.valueMeta.displayValue)) {
      return (<ScalarField field={field} highlights={highlights} setHighlights={setHighlights} />)
    } else {
      console.warn(`Could not render '${scalar.name}' field with value of type '${ft}':`, field)
      return (<></>)
    }
  } else {
    const set = field as SetFieldMeta<any>
    const ft = typeof set.valueMetas[0].value
    if (ft !== 'object' || some(set.valueMetas, vm => !empty(vm.displayValue))) {
      return (<SetField field={field} highlights={highlights} setHighlights={setHighlights} />)
    } else {
      console.warn(`Could not render '${set.name}' field with value of type '${ft}':`, field)
      return (<></>)
    }
  }
}

export default Field
