import { Tooltip } from 'components/Tooltip'
import { useState } from 'react'
import styles from './styles.module.css'

function App() {
  const [anchorId, setAnchorId] = useState('button')

  return (
    <main className={styles['main']}>
      <button
        id="button"
        aria-describedby="tooltip"
        onClick={() => {
          setAnchorId('button')
        }}
      >
        My button
      </button>
      <Tooltip id="tooltip" anchorId={anchorId} content="My big tooltip content" />

      <section style={{ marginTop: '100px' }}>
        <p>
          <button
            id="button2"
            data-tip="Hello World from a Tooltip"
            onClick={() => {
              setAnchorId('button2')
            }}
          >
            Hover or focus me
          </button>
          <button
            id="button3"
            data-tip="Hello World from a Tooltip 2"
            onClick={() => {
              setAnchorId('button3')
            }}
          >
            Hover or focus me 2
          </button>
        </p>
      </section>
    </main>
  )
}

export default App
