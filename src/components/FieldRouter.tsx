import React from 'react'
import { keys, max, min, partition, sortBy, values } from 'lodash-es'

import { RailID, Source, FieldMeta, ScalarFieldMeta, SetFieldMeta } from 'rail-id'

import { hashCode } from '../util'

import Field from './fields/generic/Field'
import CountryField from './fields/custom/CountryField'
import KeeperField from './fields/custom/KeeperField'
import OtherNotesField from './fields/custom/OtherNotesField'

type Props = {
  result: RailID | undefined
}

export type FieldElementProps = {
  field: FieldMeta<any>
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
enum Priority { ExtraHigh, High, MediumHigh, Medium, MediumLow, Low, ExtraLow }
const FieldPriorities: Map<Priority> = {
  'type':              Priority.High,
  'subtype':           Priority.High,
  'coach.class':       Priority.High,
  'special':           Priority.MediumHigh,
  'coach':             Priority.MediumHigh,
  'country':           Priority.Medium,
  'keeper':            Priority.Medium,
  'serial':            Priority.Low,
  'notes':             Priority.ExtraLow,
}

// Lookup field priority by finding the longest matching path prefix in the priority map
const fieldPriority = (f: FieldMeta<any>) => keys(FieldPriorities)
  .filter(prefix => f.path.startsWith(prefix))
  .sort((a, b) => b.length - a.length)
  .slice(0, 1)
  .map(key => FieldPriorities[key])
  .pop() ?? Priority.MediumLow

// Creates elements for each field using the lookup map
const buildElems = (fields: FieldMeta<any>[], elemMap: Map<ComponentFactory>) =>
  fields
    .map(field => ({ field, fn: elemMap[field.path] ?? Field }))
    .map(({ field, fn }) => ({ field, elem: fn({ field }) }))
    .map(({ field, elem }) => React.cloneElement(elem, { key: hashCode(field.path) }))

// Simple method to determine sort order of a field given its start/end positions in the code
const sortValue = (source: Source, priority: Priority = Priority.MediumLow) => {
  const [ start, end ] = [ min(source), max(source) ] as [number, number]
  const centerOfMass = start + (end - start) / 2
  return 1000 * priority + centerOfMass
}

function FieldRouter({ result }: Props) {
  if (result !== undefined) {

    // Order fields by their source location in the code
    const fields = sortBy(values(result._meta.fields), (f: FieldMeta<any>) => {
      if (f.type === 'set') {
        const set = f as SetFieldMeta<any>
        return sortValue(set.valueMetas.flatMap(m => m.source), fieldPriority(f))
      } else {
        const scalar = f as ScalarFieldMeta<any>
        return sortValue(f.valueMeta.source, fieldPriority(f))
      }
    })

    // Split meta fields from vehicle ones
    const [ metaFields, vehicleFields ] = partition(fields, f => f.path.startsWith('_meta'))

    // Generate element sets
    const vehicleElems = buildElems(vehicleFields, CustomComponents)
    //TODO const metaElems = buildElems(metaFields, MetaFieldMap)

    return (
      <div className="field-router columns" >
        <div className="field-router-inner column is-12-mobile is-11-tablet is-8-desktop is-8-widescreen is-8-fullhd">
          { vehicleElems }
        </div>
      </div>
    )
  } else return (<></>)
}

export default FieldRouter
