import { StrictMode, version } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-tooltip/dist/react-tooltip.css'
import './index.css'
import App from './App'

console.log('Examples folder loaded React version: ', version)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
