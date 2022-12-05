import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.scss'
import { urlDecodeCode } from './util'

// Vite-injected values
declare const __DESCRIPTION__: string
declare const __PKG_NAME__: string
declare const __VERSION__: string
declare const __LICENSE__: string
declare const __REPOSITORY__: string

// Package info (injected by vite)
const appInfo = {
  name: 'Rail ID',
  description: __DESCRIPTION__ ?? '',
  pkgName: __PKG_NAME__ ?? '',
  version: __VERSION__ ?? '',
  license: __LICENSE__ ?? '',
  repository: __REPOSITORY__ ?? ''
}

// Get url param if one was passed
const urlParams = new URLSearchParams(window.location.search)
const escaped = urlParams.get('c') ?? undefined

// Remove param from url and create new history entry
var code = ''
if (escaped && escaped.trim().length > 0) {
  code = urlDecodeCode(escaped)
  urlParams.delete('c')
  const { origin, pathname } = window.location
  window.history.pushState({}, document.title, origin + pathname)
}

// Bind app to dom
ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(<StrictMode> <App codeParam={code} appInfo={appInfo} /> </StrictMode>)
