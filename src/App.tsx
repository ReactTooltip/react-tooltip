import { TooltipController as Tooltip } from 'components/TooltipController'
import { TooltipProvider, useTooltip } from 'components/TooltipProvider'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

function WithProvider() {
  const { attach, detach } = useTooltip()
  const buttonRef1 = useRef<HTMLButtonElement>(null)
  const buttonRef2 = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    attach(buttonRef1, buttonRef2)
    return () => {
      detach(buttonRef1, buttonRef2)
    }
  }, [])

  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <button ref={buttonRef1} data-tooltip-content="Hello World from a Tooltip">
          Hover or focus me
        </button>
        <button ref={buttonRef2} data-tooltip-content="Hello World from a Tooltip 2">
          Hover or focus me 2
        </button>
      </p>
      <Tooltip />
    </section>
  )
}

function App() {
  const [anchorId, setAnchorId] = useState('button')
  const [isDarkOpen, setIsDarkOpen] = useState(false)

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
      <Tooltip
        place="bottom"
        anchorId={anchorId}
        content="My big tooltip content"
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
      />
      <Tooltip
        place="top"
        variant="success"
        anchorId="button2"
        content="My big tooltip content"
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
      />
      <Tooltip
        place="top"
        variant="info"
        anchorId="button3"
        content="My big tooltip content"
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
      />
      <Tooltip
        place="right"
        variant="info"
        anchorId="button3"
        content="My big tooltip content"
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
        style={{ backgroundColor: '#ff00ff' }}
      />

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
      <TooltipProvider>
        <WithProvider />
      </TooltipProvider>
    </main>
  )
}

export default App
