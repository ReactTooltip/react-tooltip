import React, { useEffect, useState, useRef } from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { computeTooltipPosition } from 'utils'
import { TooltipController } from '../components/TooltipController'
import {
  advanceTimers,
  flushPendingTimers,
  hoverAnchor,
  unhoverAnchor,
  clickAnchor,
  waitForTooltip,
  waitForTooltipToClose,
} from './test-utils'
import { installMockMutationObserver } from './mutation-observer-test-utils'

jest.mock('utils', () => {
  const originalModule = jest.requireActual('utils')
  return {
    ...originalModule,
    computeTooltipPosition: jest.fn(originalModule.computeTooltipPosition),
  }
})

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

describe('tooltip controlled state and refs', () => {
  let mutationObserverController

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    mutationObserverController = installMockMutationObserver()
  })

  afterEach(() => {
    flushPendingTimers()
    mutationObserverController.restore()
    jest.useRealTimers()
  })

  test('supports delayed visibility with controlled state', async () => {
    const AlreadyRenderedTest = () => {
      const [isVisible, setIsVisible] = useState(false)

      useEffect(() => {
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 50)
        return () => clearTimeout(timer)
      }, [])

      return (
        <div>
          <span data-tooltip-id="already-rendered-test">Hover Me</span>
          <TooltipController
            id="already-rendered-test"
            content="Already Rendered Test"
            delayShow={50}
            delayHide={50}
            isOpen={isVisible}
          />
        </div>
      )
    }

    render(<AlreadyRenderedTest />)

    advanceTimers(100)
    await waitForTooltip('already-rendered-test')

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 10)
    expect(document.getElementById('already-rendered-test')).toBeInTheDocument()

    unhoverAnchor(anchor, 500)
    expect(document.getElementById('already-rendered-test')).toBeInTheDocument()
  })

  test('updates anchorSelect state when matching nodes are removed', () => {
    const SelectorTryCatchTest = () => {
      const [showElement, setShowElement] = useState(true)

      useEffect(() => {
        const malformedElement = document.createElement('div')
        malformedElement.id = 'malformed-element'
        document.body.appendChild(malformedElement)

        const timer = setTimeout(() => {
          document.body.removeChild(malformedElement)
          setShowElement(false)
        }, 100)

        return () => {
          clearTimeout(timer)
          const current = document.getElementById('malformed-element')
          if (current) {
            document.body.removeChild(current)
          }
        }
      }, [])

      return (
        <div>
          {showElement && (
            <div id="selector-container">
              <span className="try-catch-selector">Target Element</span>
            </div>
          )}
          <TooltipController
            id="selector-try-catch-test"
            content="Selector Try Catch Test"
            anchorSelect=".try-catch-selector"
          />
        </div>
      )
    }

    render(<SelectorTryCatchTest />)

    expect(document.querySelector('.try-catch-selector')).toBeInTheDocument()
    advanceTimers(200)
    mutationObserverController.triggerAll([
      {
        type: 'childList',
        removedNodes: [],
        addedNodes: [],
      },
    ])
    expect(document.querySelector('.try-catch-selector')).not.toBeInTheDocument()
  })

  test('tolerates null forwarded refs during open and close flows', async () => {
    const NullTooltipRefTest = () => {
      const tooltipRef = useRef(null)

      return (
        <div>
          <span data-tooltip-id="null-ref-test">Hover Me</span>
          <TooltipController id="null-ref-test" content="Null Ref Test" ref={tooltipRef} />
        </div>
      )
    }

    render(<NullTooltipRefTest />)

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    await waitForTooltip('null-ref-test')

    unhoverAnchor(anchor, 100)
    await waitForTooltipToClose('null-ref-test')
  })

  test('preserves unrelated aria-describedby values when hiding', async () => {
    render(
      <>
        <span data-tooltip-id="aria-describedby-test" aria-describedby="external-description">
          Hover Me
        </span>
        <TooltipController id="aria-describedby-test" content="Aria Describedby Test" />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    await waitForTooltip('aria-describedby-test')
    expect(anchor).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('external-description'),
    )
    expect(anchor).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('aria-describedby-test'),
    )

    unhoverAnchor(anchor, 100)
    await waitForTooltipToClose('aria-describedby-test')

    expect(anchor).toHaveAttribute('aria-describedby', 'external-description')
  })

  test('opens by default when defaultIsOpen is enabled', async () => {
    render(
      <>
        <span data-tooltip-id="default-open-test">Hover Me</span>
        <TooltipController id="default-open-test" content="Default Open Test" defaultIsOpen />
      </>,
    )

    advanceTimers(20)
    await waitForTooltip('default-open-test')
  })

  test('no-ops when a cached imperative ref method is called after unmount', () => {
    let cachedOpen

    const ImperativeUnmountTest = () => {
      const tooltipRef = useRef(null)

      useEffect(() => {
        cachedOpen = tooltipRef.current?.open
      }, [])

      return (
        <>
          <span data-tooltip-id="imperative-unmount-test">Hover Me</span>
          <TooltipController
            id="imperative-unmount-test"
            content="Imperative Unmount Test"
            ref={tooltipRef}
          />
        </>
      )
    }

    const { unmount } = render(<ImperativeUnmountTest />)

    unmount()

    expect(() => {
      cachedOpen?.()
      advanceTimers(20)
    }).not.toThrow()
    expect(document.getElementById('imperative-unmount-test')).not.toBeInTheDocument()
  })

  test('warns and aborts imperative open when anchorSelect is invalid', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const InvalidSelectorOpenTest = () => {
      const tooltipRef = useRef(null)

      return (
        <>
          <button onClick={() => tooltipRef.current?.open({ anchorSelect: '[invalid-selector' })}>
            Open Tooltip
          </button>
          <TooltipController
            id="invalid-selector-open-test"
            content="Invalid Selector Open Test"
            ref={tooltipRef}
          />
        </>
      )
    }

    render(<InvalidSelectorOpenTest />)

    clickAnchor(screen.getByText('Open Tooltip'), 0)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[react-tooltip] "[invalid-selector" is not a valid CSS selector',
    )
    expect(document.getElementById('invalid-selector-open-test')).not.toBeInTheDocument()

    consoleWarnSpy.mockRestore()
  })

  test('honors imperative open and close delays', async () => {
    const DelayedImperativeTest = () => {
      const tooltipRef = useRef(null)

      return (
        <>
          <button onClick={() => tooltipRef.current?.open({ delay: 50 })}>Open Delayed</button>
          <button onClick={() => tooltipRef.current?.close({ delay: 50 })}>Close Delayed</button>
          <span data-tooltip-id="delayed-imperative-test">Hover Me</span>
          <TooltipController
            id="delayed-imperative-test"
            content="Delayed Imperative Test"
            ref={tooltipRef}
          />
        </>
      )
    }

    render(<DelayedImperativeTest />)

    fireEvent.click(screen.getByText('Open Delayed'))
    advanceTimers(40)
    expect(document.getElementById('delayed-imperative-test')).not.toBeInTheDocument()

    advanceTimers(20)
    await waitForTooltip('delayed-imperative-test')

    fireEvent.click(screen.getByText('Close Delayed'))
    advanceTimers(40)
    expect(document.getElementById('delayed-imperative-test')).toBeInTheDocument()

    advanceTimers(20)
    await waitFor(() => {
      const tooltip = document.getElementById('delayed-imperative-test')
      expect(tooltip === null || tooltip.classList.contains('react-tooltip__closing')).toBe(true)
    })
  })

  test('ignores deferred position updates after unmount', async () => {
    let resolvePosition

    computeTooltipPosition.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePosition = resolve
        }),
    )

    const DeferredPositionTest = () => {
      const tooltipRef = useRef(null)

      return (
        <>
          <button onClick={() => tooltipRef.current?.open({ position: { x: 10, y: 20 } })}>
            Open Deferred
          </button>
          <TooltipController
            id="deferred-position-test"
            content="Deferred Position Test"
            ref={tooltipRef}
          />
        </>
      )
    }

    const { unmount } = render(<DeferredPositionTest />)

    fireEvent.click(screen.getByText('Open Deferred'))
    advanceTimers(20)
    unmount()

    await act(async () => {
      resolvePosition({
        tooltipStyles: { left: '10px', top: '20px' },
        tooltipArrowStyles: {},
        place: 'top',
      })
      await Promise.resolve()
    })

    expect(document.getElementById('deferred-position-test')).not.toBeInTheDocument()
  })
})
