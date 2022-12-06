import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginFonts } from 'vite-plugin-fonts'
import faviconsPlugin from '@darkobits/vite-plugin-favicons'
import lightningcss from 'vite-plugin-lightningcss'
import compress from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import analyze from 'rollup-plugin-analyzer'

import pkg from './package.json' assert { type: "json" }

const browserslist = 'last 3 versions, >= 95% in US'


// https://vitejs.dev/config/
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
  base: mode === 'prod' ? '/rail-id-web/' : '/',
  publicDir: './src/assets',
  define: {
    '__PKG_NAME__':    JSON.stringify(pkg.name),
    '__DESCRIPTION__': JSON.stringify(pkg.description),
    '__VERSION__':     JSON.stringify(pkg.version),
    '__REPOSITORY__':  JSON.stringify(pkg.repository),
    '__LICENSE__':     JSON.stringify(pkg.license)
  },
  plugins: [
    VitePWA({
      mode: 'development',
      base: '/',
      includeAssets: ['logo.svg', 'splash.png'],
      manifest: {
        name: 'Rail ID',
        short_name: 'Rail ID',
        theme_color: '#646cff',
        icons: [
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: "splash.png",
            sizes: "512x512",
            type: "image/png",
            purpose: 'any'
          }
        ]
      }
    }),
    react(),
    lightningcss({ browserslist }),
    faviconsPlugin({
      xpath: './src/assets/favicon.svg',
      icons: {
        favicons: {
          source: './src/assets/favicon.svg'
        }
      }
    }),
    VitePluginFonts({
      google: {
        families: [
          {
            name: 'JetBrains Mono',
            styles: 'wght@100;200;400;500;600;700;800;900'
          },
        ]
      }
    }),
    compress({ algorithm: 'brotliCompress' }),
    analyze({ limit: 20, summaryOnly: true })
  ]
})
