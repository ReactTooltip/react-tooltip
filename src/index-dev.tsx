import { StrictMode, version } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

console.log('parent folder react version: ', version)

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
