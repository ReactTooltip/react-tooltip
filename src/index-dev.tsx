import { createRoot } from 'react-dom/client'
import './tailwind.module.css'
import App from './App'

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(<App />)
