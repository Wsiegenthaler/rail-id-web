import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.scss'
import { urlDecodeCode } from './util'

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
  .render(<StrictMode> <App codeParam={code} /> </StrictMode>)
