import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faviconsPlugin from '@darkobits/vite-plugin-favicons'
import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/
export default defineConfig({
  build: { minify: 'terser' },
  plugins: [
    react(),
    faviconsPlugin({
      xpath: './src/assets/favicon.svg',
      icons: {
        favicons: {
          source: './src/assets/favicon.svg'
        }
      }
    }),
    analyze({ limit: 20, summaryOnly: true })
  ]
})
