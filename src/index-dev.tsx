import React, { version } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './tokens.css'

console.log('Parent folder loaded react version: ', version)

ReactDOM.render(<App />, document.getElementById('app'))
