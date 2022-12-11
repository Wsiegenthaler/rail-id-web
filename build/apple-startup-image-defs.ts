import { groupBy, uniqBy, values } from 'lodash-es'

import devices from './apple-fallback-data.json' assert { type: "json" }

import { AppleStartupDef, Size2D } from './plugins/vite-plugin-icons'

// Types pertaining to `devices` metadata file
type InputSize = { width: number, height: number }

// Types for output definitions
type OutputDef = {
  device: string,
  size: Size2D,
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


export default (iconPercent: number, themeColor: string, sourceIcon: string): AppleStartupDef[] =>
  groups.map(defs => ({
      type: 'apple',
      purpose: 'startup-image',
      in: sourceIcon,
      out: (s: Size2D) => `assets/apple-startup-${defs[0].orientation}-${defs[0].scaleFactor}px-${s.w}x${s.h}.png`,
      sizes: defs.flatMap(d => d.size),
      orientation: defs[0].orientation,
      scaleFactor: defs[0].scaleFactor,
      iconPercent: iconPercent,
      background: themeColor
  }))
