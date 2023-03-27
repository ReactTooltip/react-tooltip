import React, { StrictMode, version } from 'react'
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client' // this is we are now using react < 18
import './tokens.css'
import App from './App'

// eslint-disable-next-line no-console
console.log('Parent folder loaded react version: ', version)

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
