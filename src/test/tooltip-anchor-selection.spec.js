import React, { useEffect, useState } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('tooltip anchor selection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    flushPendingTimers()
    jest.useRealTimers()
  })

  test('closes after scroll and resize listeners fire', async () => {
    render(
      <>
        <span data-tooltip-id="scroll-resize-test">Hover Me</span>
        <TooltipController
          id="scroll-resize-test"
          content="Scroll Resize Test"
          globalCloseEvents={{ scroll: true, resize: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 1000)
    await waitForTooltip('scroll-resize-test')

    fireEvent.scroll(window)
    await waitForTooltipToClose('scroll-resize-test')

    hoverAnchor(anchor, 1000)
    await waitForTooltip('scroll-resize-test')

    fireEvent.resize(window)
    await waitForTooltipToClose('scroll-resize-test')
  })

  test('unmounts cleanly after opening and closing', async () => {
    const { unmount } = render(
      <>
        <span data-tooltip-id="cleanup-functions-test">Hover Me</span>
        <TooltipController
          id="cleanup-functions-test"
          content="Cleanup Functions Test"
          globalCloseEvents={{ scroll: true, resize: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 1000)
    await waitForTooltip('cleanup-functions-test')

    unhoverAnchor(anchor, 1000)
    await waitForTooltipToClose('cleanup-functions-test')

    expect(() => unmount()).not.toThrow()
  })

  test('supports custom anchorSelect selectors', async () => {
    render(
      <div>
        <div className="custom-anchor">Custom Anchor</div>
        <TooltipController
          id="selector-variable-test"
          content="Selector Variable Test"
          anchorSelect=".custom-anchor"
        />
      </div>,
    )

    const anchor = screen.getByText('Custom Anchor')
    hoverAnchor(anchor, 1000)

    const tooltip = await waitForTooltip('selector-variable-test')
    expect(tooltip).toHaveTextContent('Selector Variable Test')
  })

  test('does not throw when anchorSelect matches nothing', () => {
    render(
      <TooltipController
        id="non-existent-selector-test"
        content="Non-existent Selector Test"
        anchorSelect=".non-existent-element"
      />,
    )

    expect(document.getElementById('non-existent-selector-test')).not.toBeInTheDocument()

    expect(() => {
      fireEvent.mouseEnter(document.body)
    }).not.toThrow()
  })

  test('mounts and unmounts safely when no anchors exist', async () => {
    const NoSelectorTest = () => {
      const [showTooltip, setShowTooltip] = useState(true)

      useEffect(() => {
        const timer = setTimeout(() => {
          setShowTooltip(false)
        }, 100)
        return () => clearTimeout(timer)
      }, [])

      return (
        <div>
          {showTooltip && <TooltipController id="no-selector-test" content="No Selector Test" />}
        </div>
      )
    }

    render(<NoSelectorTest />)

    expect(screen.queryByText('No Selector Test')).not.toBeInTheDocument()

    advanceTimers(200)

    await waitFor(() => {
      expect(screen.queryByText('No Selector Test')).not.toBeInTheDocument()
    })
  })
})
