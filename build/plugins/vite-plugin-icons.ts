import fsPromises from 'fs/promises'
import path from 'path'

import sharp from 'sharp'
import toIco from 'to-ico'

import { InputOptions, PluginContext } from 'rollup'
import { Plugin } from 'vite'


//
// This vite plugin converts icons to various formats and sizes necessary for page favicons,
// PWA icons/spash images, Apple touch icons, etc
//

const format = (def: Def, size?: Size1D | Size2D) => 
  (/[^\.]+$/g.exec(outFilePath(def, '.', size)) ?? ['png'])
    .map(f => f.toLowerCase()).pop() as string

const outFilePath = (def: Def, outDir: string, size?: Size1D | Size2D) => 
  path.join(outDir ?? '.', (typeof def.out === 'string') ? def.out : def.out(size))

async function svgToIco(inFile: string, sizes: Size1D[]) {
  const promises = sizes.map(size => new Promise((accept, reject) => 
    sharp(inFile)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png({ compressionLevel: 0 })
      .toBuffer()
      .then(buffer => accept(buffer))
      .catch(error => reject(error))))

  const buffers = await Promise.all(promises)
  return new Uint8Array(await toIco(buffers))
}

const injectHtml = (indexHtml: string, base: string, defs: Def[], outDir: string) => {
  const links = genHtml(defs, base, outDir)
  return indexHtml.replace('</head>', `\n${links}\n</head>`)
}

const genHtml = (defs: Def[], base: string, outDir: string) => {
  const filePath = (def: Def, size?: Size2D | Size1D) => path.join('/', base, outFilePath(def, outDir, size))
  const imgCount = (defs: Def[]) => defs.reduce((cnt, def) => cnt + def.sizes.length, 0)

  const favicons = defs.filter(def => def.type === 'favicon')

  // ICO favicons
  const icoFaviconLinks = favicons
    .filter(def => format(def) === 'ico')
    .map(def => `<link rel="icon" href="${filePath(def)}" sizes="any">`)

  // SVG favicons
  const svgFaviconLinks = favicons
    .filter(def => format(def) === 'svg')
    .map(def => `<link rel="icon" href="${filePath(def)}" type="image/svg+xml" sizes="any">`)

  // PNG favicons
  const pngFaviconLinks = favicons
    .filter(def => format(def) === 'png')
    .flatMap(def => def.sizes.map(size => `<link rel="icon" href="${filePath(def, size)}" type="image/png" sizes="${size}x${size}">`))

  // Apple touch icons
  const appleTouchIcons = defs.filter(def => def.type === 'apple' && def.purpose === 'touch-icon')
  const appleTouchIconLinks = appleTouchIcons
    .flatMap(def => def.sizes.map(size => 
      (imgCount(appleTouchIcons) === 1) ?
        `<link rel="apple-touch-icon" href="${filePath(def, size)}" type="image/png">` :
        `<link rel="apple-touch-icon" href="${filePath(def, size)}" type="image/png" sizes="${size}x${size}">`
    ))

  // Apple startup images
  const appleStartupImages = defs.filter(def => def.type === 'apple' && def.purpose === 'startup-image')
  const appleStartupImageLinks = appleStartupImages
    .flatMap(def => def as AppleStartupDef)
    .flatMap(def => def.sizes.map(size => {
      const adjustedWidth = size.w / def.scaleFactor
      const href = filePath(def, size)
      return `<link rel="apple-touch-startup-image" href="${href}" media="(device-width: ${adjustedWidth}px) and (orientation: ${def.orientation}) and (-webkit-device-pixel-ratio: ${def.scaleFactor})">`
    }))

  const appleWebAppCapable = '<meta name="apple-mobile-web-app-capable" content="yes">'
 
  return [
    ...icoFaviconLinks,
    ...svgFaviconLinks,
    ...pngFaviconLinks,
    ...appleTouchIconLinks,
    ...appleStartupImageLinks,
    appleWebAppCapable
  ].join('    \n')
}

const emit = (ctx: PluginContext, file: string, buffer: ArrayBufferLike) =>
  ctx.emitFile({ type: 'asset', fileName: file, source: new Uint8Array(buffer) })

const genIcons = async (ctx: PluginContext, defs: Def[], inDir: string, outDir: string) => {
  for (const i in defs) {
    const def = defs[i]

    try {
      const inFile = path.join(inDir, def.in)

      // Special handling of apple-startup-images which are always assumed to be png
      if (def.type === 'apple' && def.purpose === 'startup-image') {

        // Generate image for each size
        for (const j in def.sizes) {
          const size = def.sizes[j]
          const outFile = outFilePath(def, outDir, size)

          if (format(def, size) !== 'png') console.warn(`apple-startup-image is expected to be png (${outFile})`)

          // Determine source image aspect ratio
          const meta = await sharp(inFile).metadata()
          const aspect = meta.width! / meta.height!
          console.log(`width = ${meta.width}, height = ${meta.height}, aspect = ${aspect}`)//TODO

          const width = size.w, height = size.h
          var iconWidth: number, iconHeight: number
          if (def.orientation === 'portrait') {
            iconWidth = Math.floor(width * def.iconPercent / 100)
            iconHeight = iconWidth * aspect
          } else {
            iconHeight = Math.floor(height * def.iconPercent / 100)
            iconWidth = iconHeight / aspect
          }
          const offset = {
            left: Math.floor((width - iconWidth) / 2),
            top: Math.floor((height - iconHeight) / 2)
          }

          // Create raster version of icon and resize
          const iconImage = await sharp(inFile)
            .resize(iconWidth, iconHeight)
            .png({ compressionLevel: 0 })
            .toBuffer({ resolveWithObject: true })

          // Composite icon in final full-size image
          const { data } = await sharp({ create: { width, height, channels: meta.channels!, background: def.background }})
            .composite([ { input: iconImage.data, ...offset } ])
            .png({ compressionLevel: 9 })
            .sharpen()
            .toBuffer({ resolveWithObject: true })

          // Emit file
          emit(ctx, outFile, data.buffer)
        }

      } else {
        // Generate other images by format
        const fmt = format(def)

        if (fmt === 'ico') {
          // Generate ico containing all specified sizes
          const outFile = outFilePath(def, outDir)
          console.log(`generatirng ${outFile} from ${inFile}...`)//TODO
          const buffer = await svgToIco(inFile, def.sizes)

          // Emit file
          emit(ctx, outFile, buffer)
        } else if (fmt === 'png') {
          for (const j in def.sizes) {
            const size = def.sizes[j]
            const outFile = outFilePath(def, outDir, size)
            console.log(`generatirng ${outFile} from ${inFile}...`)//TODO

            // Generate png
            const { data } = await sharp(inFile)
              .resize({ height: size, width: size })
              .png({ compressionLevel: 9 })
              .sharpen()
              .toBuffer({ resolveWithObject: true })

            // Emit file
            emit(ctx, outFile, data.buffer)
          }
        } else if (fmt === 'svg') {
          const buffer = await fsPromises.readFile(inFile)
          emit(ctx, outFilePath(def, outDir), buffer)
        } else console.warn(`Unknown format ${fmt} for icon (in: '${def.in}', out: '${def.out}')`)
      }
    } catch(err) {
      console.error(err)
    }
  }
}

export type Size1D = number
export type Size2D = { w: number, h: number }

type ImagePath<S extends Size1D | Size2D> = string | ((s: S) => string)

type Def = FaviconDef | PwaDef | AppleIconDef | AppleStartupDef

type ImageDef1D = {
  in: string
  sizes: Size1D[]
  out: ImagePath<Size1D>
}

type ImageDef2D = {
  in: string
  sizes: Size2D[]
  out: ImagePath<Size2D>
}

export type FaviconDef = ImageDef1D & { type: 'favicon' }
export type PwaDef = ImageDef1D & { type: 'pwa' }

export type AppleIconDef = ImageDef1D & { type: 'apple', purpose: 'touch-icon' }

export type AppleStartupDef = ImageDef2D & {
  type: 'apple'
  purpose: 'startup-image'
  orientation: 'portrait' | 'landscape'
  iconPercent: number
  background: string
  scaleFactor: number
}

type PluginOptions = {
  inDir: string
  outDir: string
  defs: Def[]
  injectHtml: boolean
}

export default function plugin(options: Partial<PluginOptions>): Plugin {
  let config

  const inDir = options.inDir ?? '.'
  const outDir = options.outDir ?? '.'
  const defs = options.defs ?? []
  const inject = options.injectHtml !== false

  return {
    name: 'vite-plugin-icons',
    apply: 'build', // skip dev builds

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async buildStart(options: InputOptions) {
      await genIcons(this, defs, inDir, outDir)
    },

    transformIndexHtml: {
      enforce: 'post',
      transform(html): string | undefined {
        if (inject) return injectHtml(html, config.base, defs, outDir)
      }
    }
  }
}