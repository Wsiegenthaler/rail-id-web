import { groupBy, uniqBy, values } from 'lodash-es'

import devices from './apple-fallback-data.json' assert { type: "json" }


// Types pertaining to `devices` metadata file
type InputSize = { width: number, height: number }
type InputDef = {
  device: string
  orientation: Orientation
  scaleFactor: number
  size: InputSize
}

// Types for output definitions
type OutputSize = { w: number, h: number }
type OutputDef = {
  device: string,
  size: OutputSize,
  orientation: Orientation
  scaleFactor: number
}

type Orientation = 'portrait' | 'landscape'


const outSize = (size: InputSize) => ({ w: size.width, h: size.height })

const outputDefs: OutputDef[] = devices.flatMap(d => [
  { device: d.device, scaleFactor: d.scaleFactor, orientation: 'portrait', size: outSize(d.portrait) },
  { device: d.device, scaleFactor: d.scaleFactor, orientation: 'landscape', size: outSize(d.landscape) }
])

const groups = values(groupBy(outputDefs, d => d.orientation + d.scaleFactor))
  .map(defs => uniqBy(defs, d => `${d.size.w}x${d.size.h}`))


export default (iconPercent: number, themeColor: string, sourceIcon: string) =>
  groups.map(defs => ({
      type: 'apple',
      purpose: 'startup-image',
      in: sourceIcon,
      out: s => `assets/apple-startup-${defs[0].orientation}-${defs[0].scaleFactor}px-${s.w}x${s.h}.png`,
      sizes: defs.flatMap(d => d.size),
      orientation: defs[0].orientation,
      scaleFactor: defs[0].scaleFactor,
      iconPercent: iconPercent,
      background: themeColor
  }))
