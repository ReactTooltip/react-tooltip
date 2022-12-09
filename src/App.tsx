import { TooltipController as Tooltip } from 'components/TooltipController'
import { TooltipProvider, useTooltip } from 'components/TooltipProvider'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

function WithProvider() {
  const { attach, detach } = useTooltip()
  const buttonRef1 = useRef<HTMLButtonElement>(null)
  const buttonRef2 = useRef<HTMLButtonElement>(null)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    attach(buttonRef1, buttonRef2)
    return () => {
      detach(buttonRef1, buttonRef2)
    }
  }, [])

  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <button
          ref={buttonRef1}
          data-tooltip-place="right"
          data-tooltip-content={`Hello World from a Tooltip ${clickCount}`}
          onClick={() => setClickCount((i) => i + 1)}
        >
          Hover or focus me 4
        </button>
        <button
          ref={buttonRef2}
          data-tooltip-place="bottom"
          data-tooltip-content="Hello World from a Tooltip 5"
        >
          Hover or focus me 5
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
        data-tooltip-content="My big tooltip content 1"
        onClick={() => {
          setAnchorId('button')
        }}
      >
        My button
      </button>
      <Tooltip
        place="bottom"
        anchorId={anchorId}
        // only shown if `data-tooltip-content` is unset
        content={`Showing tooltip on ${anchorId}`}
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
      />
      <Tooltip
        place="top"
        variant="success"
        anchorId="button2"
        isOpen={isDarkOpen}
        setIsOpen={setIsDarkOpen}
      />
      <Tooltip
        place="top"
        variant="info"
        anchorId="button3"
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
            data-tooltip-content="Hello World from a Tooltip 2"
            onClick={() => {
              setAnchorId('button2')
            }}
          >
            Hover or focus me
          </button>
          <button
            id="button3"
            data-tooltip-content="Hello World from a Tooltip 3"
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
