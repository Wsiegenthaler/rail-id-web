import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginFonts } from 'vite-plugin-fonts'
import faviconsPlugin from '@darkobits/vite-plugin-favicons'
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

// https://vitejs.dev/config
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
  base: mode === 'production' ? '/rail-id-web/' : '/',
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
          in: 'icon.svg',
          out: `favicon.ico`,
          sizes: [16, 24, 32, 48, 64]
        },
        {
          type: 'favicon',
          in: 'icon.svg',
          out: sz => `assets/favicon-${sz}.png`,
          sizes: [16, 24, 32, 48, 64]
        },
        {
          type: 'apple',
          purpose: 'touch-icon',
          in: 'icon-masked.svg',
          out: sz => `assets/apple-touch-icon-${sz}.png`,
          sizes: [120, 152, 167, 180]
        },
        {
          type: 'apple',
          purpose: 'touch-icon',
          in: 'icon-masked.svg',
          out: sz => `assets/apple-touch-icon-${sz}.png`,
          sizes: [120, 152, 167, 180]
        },
        {
          type: 'pwa',
          in: 'icon-masked.svg',
          out: sz => `assets/pwa-${sz}.png`,
          sizes: [152, 512]
        },
        {
          type: 'favicon',
          in: 'icon.svg',
          out: `assets/icon.svg`,
          sizes: []
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
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'assets/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'assets/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    react(),
    lightningcss({ browserslist }),
    VitePluginFonts({
      google: {
        families: [
          {
            name: 'Quicksand',
            styles: 'wght@100;200;400;500;600;700;800;900'
          },
          {
            name: 'JetBrains Mono',
            styles: 'wght@400'
          },
        ]
      }
    }),
    compress({ algorithm: 'brotliCompress' }),
    analyze({ limit: 20, summaryOnly: true })
  ]
})
