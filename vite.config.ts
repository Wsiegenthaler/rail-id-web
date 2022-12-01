import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginFonts } from 'vite-plugin-fonts'
import faviconsPlugin from '@darkobits/vite-plugin-favicons'
import lightningcss from 'vite-plugin-lightningcss'
import compress from 'vite-plugin-compression'
import analyze from 'rollup-plugin-analyzer'


const browserslist = 'last 3 versions, >= 95% in US'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      manualChunks: {
        'rail-id': [ 'rail-id' ],
        'flags': [ 'react-world-flags' ]
      }
    }
  },
  plugins: [
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
