import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webfontDownload from 'vite-plugin-webfont-dl'
import lightningcss from 'vite-plugin-lightningcss'
import compress from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import analyze from 'rollup-plugin-analyzer'

import iconPlugin from './build/plugins/vite-plugin-icons'
import appleStartupImageDefs from './build/apple-startup-image-defs'

import pkg from './package.json' assert { type: "json" }

// Constants
const browserslist = 'last 3 versions, >= 95% in US'
const themeColor = '#202024'
const pwaIconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Config (https://vitejs.dev/config)
export default ({ mode }) => defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      manualChunks: {
        'parser': [ 'rail-id' ],
        'world-flags': [ '@weston/react-world-flags' ]
      }
    }
  },
  base: process.env.RAIL_ID_BASE ?? '/',
  publicDir: './src/assets',
  define: {
    '__PKG_NAME__':    JSON.stringify(pkg.name),
    '__DESCRIPTION__': JSON.stringify(pkg.description),
    '__VERSION__':     JSON.stringify(pkg.version),
    '__REPOSITORY__':  JSON.stringify(pkg.repository),
    '__LICENSE__':     JSON.stringify(pkg.license)
  },
  plugins: [
    iconPlugin({
      inDir: './src/assets',
      defs: [
        {
          type: 'favicon',
          in: 'icon-rounded.svg',
          out: `favicon.ico`,
          sizes: [16, 24, 32, 48, 64]
        },
        {
          type: 'favicon',
          in: 'icon-rounded.svg',
          out: sz => `assets/favicon-${sz}.png`,
          sizes: [16, 24, 32, 48, 64]
        },
        {
          type: 'favicon',
          in: 'icon-rounded.svg',
          out: `assets/favicon.svg`,
          sizes: []
        },
        {
          type: 'apple',
          purpose: 'touch-icon',
          in: 'icon-rounded.svg',
          out: sz => `assets/apple-touch-icon-${sz}.png`,
          sizes: [120, 152, 167, 180]
        },
        {
          type: 'pwa',
          in: 'icon-rounded.svg',
          out: sz => `assets/pwa-icon-${sz}.png`,
          sizes: pwaIconSizes
        },
        {
          type: 'pwa',
          in: 'icon-rounded.svg',
          out: sz => `assets/pwa-icon-mask-${sz}.png`,
          sizes: pwaIconSizes
        },
        // Apple Startup images
        ...appleStartupImageDefs(25, themeColor, 'icon.svg')
      ]
    }),
    VitePWA({
      mode: 'development',
      manifest: {
        name: 'Rail ID',
        short_name: 'Rail ID',
        theme_color: themeColor,
        icons: [
          // Vector icon
          {
            src: 'icon-rounded.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          // Regular icons
          ...pwaIconSizes.map(sz => ({
            src: `assets/pwa-icon-${sz}.png`,
            sizes: `${sz}x${sz}`,
            type: 'image/png',
            purpose: 'any'
          })),
          // Maskable icons
          ...pwaIconSizes.map(sz => ({
            src: `assets/pwa-icon-mask-${sz}.png`,
            sizes: `${sz}x${sz}`,
            type: 'image/png',
            purpose: 'any maskable'
          }))
        ]
      }
    }),
    react(),
    lightningcss({ browserslist }),
    webfontDownload(),
    compress({ algorithm: 'brotliCompress' }),
    analyze({ limit: 20, summaryOnly: true })
  ]
})
