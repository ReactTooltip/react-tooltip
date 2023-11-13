/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { TooltipController as Tooltip } from 'components/TooltipController'
import { IPosition, TooltipRefProps } from 'components/Tooltip/TooltipTypes.d'
import React, { useEffect, useRef, useState } from 'react'
import { inline, offset } from '@floating-ui/dom'
import styles from './styles.module.css'

function App() {
  const [anchorId, setAnchorId] = useState('button')
  const [isDarkOpen, setIsDarkOpen] = useState(false)
  const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 })
  const [toggle, setToggle] = useState(false)
  const tooltipRef = useRef<TooltipRefProps>(null)

  const handlePositionClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const x = event.clientX
    const y = event.clientY
    setPosition({ x, y })
  }

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const target = event.target as HTMLElement
    setAnchorId(target.id)
  }

  useEffect(() => {
    const handleQ = (event: KeyboardEvent) => {
      if (event.key === 'q') {
        // q
        tooltipRef.current?.close()
      }
    }
    window.addEventListener('keydown', handleQ)
    return () => {
      window.removeEventListener('keydown', handleQ)
    }
  })

  return (
    <main className={styles['main']}>
      <button
        id="button"
        aria-describedby="tooltip"
        data-tooltip-content="My big tooltip content 1"
        onClick={handleButtonClick}
      >
        My button
      </button>
      <Tooltip place="bottom" anchorId={anchorId} isOpen={isDarkOpen} setIsOpen={setIsDarkOpen} />
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
            onClick={handleButtonClick}
          >
            Hover or focus me
          </button>
          <button
            id="button3"
            data-tooltip-content="Hello World from a Tooltip 3"
            onClick={handleButtonClick}
          >
            Hover or focus me 2
          </button>
        </p>
      </section>
      <section id="section-anchor-select" style={{ marginTop: '100px' }}>
        <p>
          <button data-tooltip-id="anchor-select" data-tooltip-content="this content is different">
            Anchor select
          </button>
          <button data-tooltip-id="anchor-select">Anchor select 2</button>
          <button data-tooltip-id="anchor-select">Anchor select 3</button>
        </p>
        <Tooltip id="anchor-select">Tooltip content</Tooltip>
        <Tooltip
          ref={tooltipRef}
          anchorSelect="section[id='section-anchor-select'] > p > button"
          place="bottom"
          openEvents={{ click: true }}
          closeEvents={{ click: true }}
          globalCloseEvents={{ clickOutsideAnchor: true }}
        >
          Tooltip content
        </Tooltip>
      </section>
      <div style={{ display: 'flex', gap: '12px', flexDirection: 'row' }}>
        <div>
          <div
            id="floatAnchor"
            /**
             * changed from dash `no-arrow` to camelcase because of:
             * https://github.com/indooorsman/esbuild-css-modules-plugin/issues/42
             */
            className={styles['bigAnchor']}
            onClick={() => {
              setToggle((t) => !t)
            }}
          >
            Hover me!
          </div>
          <Tooltip
            anchorId="floatAnchor"
            content={
              toggle
                ? 'This is a float tooltip with a very very large content string'
                : 'This is a float tooltip'
            }
            float
          />
        </div>
        <div>
          <div
            id="onClickAnchor"
            /**
             * changed from dash `no-arrow` to camelcase because of:
             * https://github.com/indooorsman/esbuild-css-modules-plugin/issues/42
             */
            className={styles['bigAnchor']}
            onClick={(event) => {
              handlePositionClick(event)
            }}
          >
            Click me!
          </div>
          <Tooltip
            anchorId="onClickAnchor"
            content={`This is an on click tooltip (x:${position.x},y:${position.y})`}
            events={['click']}
            position={position}
            positionStrategy="fixed"
          />
        </div>
        <button
          id="imperativeTooltipButton"
          style={{ height: 40, marginLeft: 100 }}
          onClick={() => {
            tooltipRef.current?.open({
              anchorSelect: '#imperativeTooltipButton',
              content: (
                <div style={{ fontSize: 32 }}>
                  Opened imperatively!
                  <br />
                  <br />
                  Press Q to close imperatively too!
                </div>
              ),
            })
          }}
        >
          imperative tooltip
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button id="buttonCallbacks">Check the dev console</button>
        <Tooltip
          place="bottom"
          anchorId="buttonCallbacks"
          // eslint-disable-next-line no-console
          afterShow={() => console.log('After show')}
          // eslint-disable-next-line no-console
          afterHide={() => console.log('After hide')}
          content="Showing tooltip and calling afterShow method"
        />

        <button id="buttonCallbacksClick">With click event</button>
        <Tooltip
          events={['click']}
          place="bottom"
          anchorId="buttonCallbacksClick"
          // eslint-disable-next-line no-console
          afterShow={() => console.log('After show with click')}
          // eslint-disable-next-line no-console
          afterHide={() => console.log('After hide with click')}
          content="Showing tooltip and calling afterShow method"
        />

        <button id="buttonCallbacksDelay">With delay</button>
        <Tooltip
          delayShow={1000}
          place="bottom"
          anchorId="buttonCallbacksDelay"
          // eslint-disable-next-line no-console
          afterShow={() => console.log('After show with delay')}
          // eslint-disable-next-line no-console
          afterHide={() => console.log('After hide with delay')}
          content="Showing tooltip and calling afterShow method"
        />
      </div>

      <div
        style={{
          width: 700,
          position: 'relative',
          overflow: 'hidden',
          marginTop: '1rem',

          boxSizing: 'border-box',
        }}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          <span id="withoutCustomMiddleware" style={{ color: 'blue', fontWeight: 'bold' }}>
            labore et dolore magna aliqua
          </span>
          . Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <Tooltip
          place="top"
          anchorId="withoutCustomMiddleware"
          content="Showing tooltip with default middlewares"
          positionStrategy="fixed"
        />
      </div>

      <div
        style={{
          width: 700,
          position: 'relative',
          overflow: 'hidden',
          marginTop: '1rem',

          boxSizing: 'border-box',
        }}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          <span id="withCustomMiddleware" style={{ color: 'blue', fontWeight: 'bold' }}>
            labore et dolore magna aliqua
          </span>
          . Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <Tooltip
          place="top"
          anchorId="withCustomMiddleware"
          content="Showing tooltip with custom inline middleware"
          positionStrategy="fixed"
          middlewares={[inline(), offset(10)]}
        />
      </div>
    </main>
  )
}

export default App
