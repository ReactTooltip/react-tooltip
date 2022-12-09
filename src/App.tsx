import { TooltipController as Tooltip } from 'components/TooltipController'
import { TooltipProvider, useTooltip } from 'components/TooltipProvider'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

function WithProvider() {
  const tooltipper = useTooltip()
  const { attach, detach } = tooltipper()
  const { attach: attach1, detach: detach1 } = tooltipper('tooltip-1')
  const { attach: attach2, detach: detach2 } = tooltipper('tooltip-2')
  const buttonRef1 = useRef<HTMLButtonElement>(null)
  const buttonRef2 = useRef<HTMLButtonElement>(null)
  const buttonRef3 = useRef<HTMLButtonElement>(null)
  const buttonRef4 = useRef<HTMLButtonElement>(null)
  const buttonRef5 = useRef<HTMLButtonElement>(null)
  const buttonRef6 = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    attach(buttonRef1, buttonRef2)
    attach1(buttonRef3, buttonRef4)
    attach2(buttonRef5, buttonRef6)
    return () => {
      detach(buttonRef1, buttonRef2)
      detach1(buttonRef3, buttonRef4)
      detach2(buttonRef5, buttonRef6)
    }
  }, [])

  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <button
          ref={buttonRef1}
          data-tooltip-place="right"
          data-tooltip-content="Hello World from a Shared Global Tooltip"
        >
          Hover or focus me 5
        </button>
        <button ref={buttonRef2} data-tooltip-content="Hello World from a Shared Global Tooltip">
          Hover or focus me 6
        </button>
      </p>
      <p>
        <button ref={buttonRef3} data-tooltip-content="Hello World from Shared Tooltip 1">
          Hover or focus me 7
        </button>
        <button ref={buttonRef4} data-tooltip-content="Hello World from Shared Tooltip 1">
          Hover or focus me 8
        </button>
      </p>
      <p>
        <button ref={buttonRef5} data-tooltip-content="Hello World from Shared Tooltip 2">
          Hover or focus me 9
        </button>
        <button ref={buttonRef6} data-tooltip-content="Hello World from Shared Tooltip 2">
          Hover or focus me 10
        </button>
      </p>
      <Tooltip />
      <Tooltip id="tooltip-1" />
      <Tooltip id="tooltip-2" />
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
