import React, { version } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './tokens.css'

// eslint-disable-next-line no-console
console.log('Parent folder loaded react version: ', version)

const container = document.getElementById('app')

if (!container) {
  throw new Error('App root element was not found.')
}

createRoot(container).render(<App />)
