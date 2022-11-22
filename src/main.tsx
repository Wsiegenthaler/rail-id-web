import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.scss'

// Get url param if one was passed
const urlParams = new URLSearchParams(window.location.search)
const codeParam = urlParams.get('code') ?? undefined

// Remove param from url and create new history entry
if (codeParam && codeParam.trim().length > 0) {
  urlParams.delete('code')
  const { origin, pathname } = window.location
  window.history.pushState({}, document.title, origin + pathname)
}

// Bind app to dom
ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render( <StrictMode> <App codeParam={codeParam} /> </StrictMode>)
