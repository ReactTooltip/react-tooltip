import React, { useEffect, useState, useRef } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController } from '../components/TooltipController'
import {
  advanceTimers,
  flushPendingTimers,
  hoverAnchor,
  unhoverAnchor,
  waitForTooltip,
  waitForTooltipToClose,
} from './test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

describe('tooltip controlled state and refs', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    flushPendingTimers()
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
})
