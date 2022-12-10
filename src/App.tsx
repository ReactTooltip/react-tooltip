import { TooltipController as Tooltip } from 'components/TooltipController'
import { TooltipProvider, TooltipWrapper } from 'components/TooltipProvider'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

function WithProviderMinimal() {
  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <TooltipWrapper place="bottom" content="Shared Global Tooltip">
          <button>Minimal 1</button>
        </TooltipWrapper>
        <TooltipWrapper place="right" content="Shared Global Tooltip">
          <button>Minimal 2</button>
        </TooltipWrapper>
      </p>
      <Tooltip />
    </section>
  )
}

function WithProviderMultiple() {
  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <TooltipWrapper tooltipId="tooltip-1" place="bottom">
          <button>Multiple 1</button>
        </TooltipWrapper>
        <TooltipWrapper tooltipId="tooltip-2" place="right">
          <button>Multiple 2</button>
        </TooltipWrapper>
      </p>
      <Tooltip id="tooltip-1" content="Tooltip 1" />
      <Tooltip id="tooltip-2" content="Tooltip 2" />
    </section>
  )
}

function WithProviderForwardRef() {
  // if access to the element's ref is needed, `TooltipWrapper.forwardRef` must be used
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Ref can still be accessed: ', ref.current)
  })

  return (
    <section style={{ marginTop: '100px' }}>
      <p>
        <TooltipWrapper forwardRef={ref} place="bottom" content="Shared Global Tooltip">
          <button
            // this will not work, must use `forwardRef` from wrapper
            ref={ref}
          >
            Forward ref 1
          </button>
        </TooltipWrapper>
        <TooltipWrapper place="right" content="Shared Global Tooltip">
          <button>Forward ref 2</button>
        </TooltipWrapper>
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
        <WithProviderMinimal />
      </TooltipProvider>
      <TooltipProvider>
        <WithProviderMultiple />
      </TooltipProvider>
      <TooltipProvider>
        <WithProviderForwardRef />
      </TooltipProvider>
    </main>
  )
}

export default App
