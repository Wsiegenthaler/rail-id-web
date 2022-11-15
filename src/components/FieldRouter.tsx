import React from 'react'
import { minBy, partition, sortBy, values } from 'lodash-es'

import { RailID, FieldMeta } from 'rail-id'

import { SetHighlights } from '../App'

import Field from '../fields/generic/Field'
import CountryField from '../fields/custom/CountryField'
import KeeperField from '../fields/custom/KeeperField'
import SpeedField from '../fields/custom/SpeedField'
import SpeedsField from '../fields/custom/SpeedsField'
import VehicleNotesField from '../fields/custom/VehicleNotesField'

type Props = {
  result: RailID | undefined
  setHighlights: SetHighlights
}

export type FieldElementProps = {
  field: FieldMeta<any>
  setHighlights: SetHighlights
}

type ElementMap = { [index: string]: (props: FieldElementProps) => JSX.Element }

// Map vehicle field paths to the elements used to render them
const VehicleFieldMap: ElementMap = {
  'country': CountryField,
  'keeper': KeeperField,
  'speeds': SpeedsField,
  'selfPropelledSpeeds': SpeedField, //TODO rename component
  'notes': VehicleNotesField
}

// Map meta field paths to the elements used to render them
//TODO deprecate meta routing in favor of purpose-built component
const MetaFieldMap: ElementMap = {
  '_meta.type': Field
}

// Creates elements for each field using the lookup map
const buildElems = (fields: FieldMeta<any>[], elemMap: ElementMap, setHighlights: SetHighlights) =>
  fields
    .map(field => ({ field, fn: elemMap[field.path] ?? Field }))
    .map(({ field, fn }) => ({ field, elem: fn({ field, setHighlights }) }))
    .map(({ field, elem }) => React.cloneElement(elem, { key: field.path }))

function FieldRouter({ result, setHighlights }: Props) {
  if (result) {

    // Order fields by their source location in the code
    const fields = sortBy(values(result._meta.fields), f => {
      if (f.type === 'set') return minBy(f.valueMetas, m => m.source?.start ?? 99)
      else return f.valueMeta.source?.start ?? 99
    })

    // Split meta fields from vehicle ones
    const [ metaFields, vehicleFields ] = partition(fields, f => f.path.startsWith('_meta'))

    vehicleFields.map(f => f.path)//TODO
    // Generate element sets
    const vehicleElems = buildElems(vehicleFields, VehicleFieldMap, setHighlights)
    const metaElems = buildElems(metaFields, MetaFieldMap, setHighlights)

    return (
      <div className="details columns">
        <div className="vehicle column is-8 is-12-mobile">
          <div>
            { vehicleElems }
          </div>
        </div>
        <div className="code column is-4 is-12-mobile">
          <h5>Code Details</h5>
          <div>
            { metaElems }
          </div>
        </div>
      </div>
    )
  } else return (<></>)
}

export default FieldRouter
