import React from 'react'
import { max, min, partition, sortBy, values } from 'lodash-es'

import { RailID, Source, FieldMeta } from 'rail-id'

import { SetHighlights } from '../App'

import Field from '../fields/generic/Field'
import CountryField from '../fields/custom/CountryField'
import KeeperField from '../fields/custom/KeeperField'
import OtherNotesField from '../fields/custom/OtherNotesField'
import { hashCode } from '../util'

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
  'notes': OtherNotesField
}

// Creates elements for each field using the lookup map
const buildElems = (fields: FieldMeta<any>[], elemMap: ElementMap, setHighlights: SetHighlights) =>
  fields
    .map(field => ({ field, fn: elemMap[field.path] ?? Field }))
    .map(({ field, fn }) => ({ field, elem: fn({ field, setHighlights }) }))
    .map(({ field, elem }) => React.cloneElement(elem, { key: hashCode(field.path) }))

// Simple method to determine sort order of a field given its start/end positions in the code
const sortValue = (source: Source) => {
  const [ start, end ] = [ min(source), max(source) ] as [number, number]
  return start + (end - start) / 2
}

function FieldRouter({ result, setHighlights }: Props) {
  if (result !== undefined) {

    // Order fields by their source location in the code
    const fields = sortBy(values(result._meta.fields), f => {
      if (f.type === 'set') return sortValue(f.valueMetas.flatMap(m => m.source))
      else return sortValue(f.valueMeta.source)
    })

    // Split meta fields from vehicle ones
    const [ metaFields, vehicleFields ] = partition(fields, f => f.path.startsWith('_meta'))

    // Generate element sets
    const vehicleElems = buildElems(vehicleFields, VehicleFieldMap, setHighlights)
    //TODO const metaElems = buildElems(metaFields, MetaFieldMap, setHighlights)

    return (
      <div className="field-router column is-12-mobile is-11-tablet is-11-desktop is-10-widescreen is-9-fullhd">
        <div className="vehicle">
          { vehicleElems }
        </div>
      </div>
    )
  } else return (<></>)
}

export default FieldRouter
