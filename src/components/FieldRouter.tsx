import React from 'react'
import { max, min, partition, sortBy, values } from 'lodash-es'

import { RailID, Source, FieldMeta } from 'rail-id'

import { SetHighlights } from '../App'

import Field from '../fields/generic/Field'
import CountryField from '../fields/custom/CountryField'
import KeeperField from '../fields/custom/KeeperField'
import OtherNotesField from '../fields/custom/OtherNotesField'
import { hashCode } from '../util'
import { ScalarFieldMeta } from 'rail-id'
import { SetFieldMeta } from 'rail-id'

type Props = {
  result: RailID | undefined
  setHighlights: SetHighlights
}

export type FieldElementProps = {
  field: FieldMeta<any>
  setHighlights: SetHighlights
}

type Map<V> = { [index: string]: V }

// Map vehicle field paths to the elements used to render them
type ComponentFactory = (props: FieldElementProps) => JSX.Element
const CustomComponents: Map<ComponentFactory> = {
  'country': CountryField,
  'keeper': KeeperField,
  'notes': OtherNotesField
}

// Allow control over field ordering
enum Priority { ExtraHigh, High, MediumHigh, Normal, MediumLow, Low, ExtraLow }
const FieldPriorities: Map<Priority> = {
  'type':            Priority.High,
  'subtype':         Priority.High,
  'country':         Priority.MediumHigh,
  'special.type':    Priority.MediumHigh,
  'special.subtype': Priority.MediumHigh,
  'serial':          Priority.Low,
  'notes':           Priority.ExtraLow,
}

// Creates elements for each field using the lookup map
const buildElems = (fields: FieldMeta<any>[], elemMap: Map<ComponentFactory>, setHighlights: SetHighlights) =>
  fields
    .map(field => ({ field, fn: elemMap[field.path] ?? Field }))
    .map(({ field, fn }) => ({ field, elem: fn({ field, setHighlights }) }))
    .map(({ field, elem }) => React.cloneElement(elem, { key: hashCode(field.path) }))

// Simple method to determine sort order of a field given its start/end positions in the code
const sortValue = (source: Source, priority: Priority = Priority.Normal) => {
  const [ start, end ] = [ min(source), max(source) ] as [number, number]
  const centerOfMass = start + (end - start) / 2
  return 1000 * priority + centerOfMass
}

function FieldRouter({ result, setHighlights }: Props) {
  if (result !== undefined) {

    // Order fields by their source location in the code
    const fields = sortBy(values(result._meta.fields), (f: FieldMeta<any>) => {
      if (f.type === 'set') {
        const set = f as SetFieldMeta<any>
        return sortValue(set.valueMetas.flatMap(m => m.source), FieldPriorities[f.path])
      } else {
        const scalar = f as ScalarFieldMeta<any>
        return sortValue(f.valueMeta.source, FieldPriorities[f.path])
      }
    })

    // Split meta fields from vehicle ones
    const [ metaFields, vehicleFields ] = partition(fields, f => f.path.startsWith('_meta'))

    // Generate element sets
    const vehicleElems = buildElems(vehicleFields, CustomComponents, setHighlights)
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
