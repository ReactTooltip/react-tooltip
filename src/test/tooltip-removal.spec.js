import React, { createRef, useState } from 'react'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController } from '../components/TooltipController'
import {
  advanceTimers,
  flushPendingTimers,
  hoverAnchor,
  unhoverAnchor,
  waitForTooltip,
} from './test-utils'
import { installMockMutationObserver } from './mutation-observer-test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

const TOOLTIP_ID = 'removal-test'
// the tooltip is rendered at once and shows 10ms later
const SHOW_TIMER_MS = 10
// long enough for a tooltip that is not showing to leave the DOM
const REMOVAL_MS = 500

const getTooltip = () => document.getElementById(TOOLTIP_ID)

const fireOpacityTransitionEnd = (tooltip) => {
  const transitionEndEvent = new Event('transitionend', { bubbles: true })
  Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'opacity' })
  fireEvent(tooltip, transitionEndEvent)
}

const expectTooltipToShow = async (tooltip) => {
  await waitFor(() => {
    expect(getTooltip()).toHaveClass('react-tooltip__show')
  })
  // the same element all along, not one that was removed and rendered again
  expect(getTooltip()).toBe(tooltip)
}

const TestTooltip = ({ tooltipRef, ...tooltipProps }) => (
  <>
    <span data-tooltip-id={TOOLTIP_ID}>Hover Me</span>
    <TooltipController id={TOOLTIP_ID} content="Removal Test" ref={tooltipRef} {...tooltipProps} />
  </>
)

describe('tooltip removal', () => {
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

  test('removes a tooltip that is opened and closed in the same turn', () => {
    const afterShow = jest.fn()
    const afterHide = jest.fn()
    const tooltipRef = createRef()

    render(<TestTooltip tooltipRef={tooltipRef} afterShow={afterShow} afterHide={afterHide} />)

    act(() => {
      tooltipRef.current.open()
      tooltipRef.current.close()
    })
    expect(getTooltip()).toBeInTheDocument()

    advanceTimers(SHOW_TIMER_MS)
    expect(getTooltip()).not.toHaveClass('react-tooltip__show')

    advanceTimers(REMOVAL_MS)
    expect(getTooltip()).not.toBeInTheDocument()
    // it never showed, so there is no show to report, and no hide after it
    expect(afterShow).not.toHaveBeenCalled()
    expect(afterHide).not.toHaveBeenCalled()
  })

  test('removes a tooltip that is closed while its show timer is pending, when both timers run in the same turn', () => {
    const tooltipRef = createRef()

    render(<TestTooltip tooltipRef={tooltipRef} />)

    act(() => {
      tooltipRef.current.open()
    })
    advanceTimers(SHOW_TIMER_MS - 5)
    act(() => {
      tooltipRef.current.close()
    })
    expect(getTooltip()).toBeInTheDocument()

    advanceTimers(REMOVAL_MS)
    expect(getTooltip()).not.toBeInTheDocument()
  })

  test('removes a controlled tooltip that is closed before it shows', () => {
    const { rerender } = render(<TestTooltip isOpen={false} />)

    rerender(<TestTooltip isOpen />)
    advanceTimers(SHOW_TIMER_MS - 5)
    rerender(<TestTooltip isOpen={false} />)
    expect(getTooltip()).toBeInTheDocument()

    advanceTimers(REMOVAL_MS)
    expect(getTooltip()).not.toBeInTheDocument()
  })

  test('removes a tooltip that a controlled `isOpen={false}` keeps from showing', () => {
    render(<TestTooltip isOpen={false} />)

    hoverAnchor(screen.getByText('Hover Me'), SHOW_TIMER_MS)
    expect(getTooltip()).toBeInTheDocument()
    expect(getTooltip()).not.toHaveClass('react-tooltip__show')

    advanceTimers(REMOVAL_MS)
    expect(getTooltip()).not.toBeInTheDocument()
  })

  test('removes a closing tooltip after a transition ends for another CSS property', async () => {
    const afterHide = jest.fn()

    render(<TestTooltip afterHide={afterHide} />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip(TOOLTIP_ID)

    unhoverAnchor(anchor, 20)
    const transitionEndEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'transform' })
    fireEvent(tooltip, transitionEndEvent)
    expect(getTooltip()).toBeInTheDocument()

    advanceTimers(REMOVAL_MS)
    expect(getTooltip()).not.toBeInTheDocument()
    expect(afterHide).toHaveBeenCalledTimes(1)
  })

  test('calls afterHide once when the anchor of a showing tooltip is removed', async () => {
    const afterHide = jest.fn()
    const AnchorRemovalTest = () => {
      const [hasAnchor, setHasAnchor] = useState(true)

      return (
        <>
          {hasAnchor && <span data-tooltip-id={TOOLTIP_ID}>Hover Me</span>}
          <button onClick={() => setHasAnchor(false)}>Remove Anchor</button>
          <TooltipController id={TOOLTIP_ID} content="Removal Test" afterHide={afterHide} />
        </>
      )
    }

    render(<AnchorRemovalTest />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    await waitForTooltip(TOOLTIP_ID)

    fireEvent.click(screen.getByText('Remove Anchor'))
    mutationObserverController.triggerAll([
      { type: 'childList', removedNodes: [anchor], addedNodes: [] },
    ])
    // the tooltip leaves the DOM with its anchor, and stops showing a moment later
    advanceTimers(50)
    advanceTimers(50)
    expect(getTooltip()).not.toBeInTheDocument()

    advanceTimers(REMOVAL_MS)
    expect(afterHide).toHaveBeenCalledTimes(1)
  })

  test('does not call afterHide when unmounted while the removal is pending', async () => {
    const afterHide = jest.fn()
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = render(<TestTooltip afterHide={afterHide} />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    await waitForTooltip(TOOLTIP_ID)
    unhoverAnchor(anchor, SHOW_TIMER_MS + 5)

    unmount()
    advanceTimers(REMOVAL_MS)

    expect(afterHide).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  /**
   * In the tests below the tooltip is hovered again while it closes,
   * and what removes it runs before the tooltip shows again.
   */
  test('keeps a tooltip that is hovered again just before its closing transition ends', async () => {
    const afterHide = jest.fn()

    render(<TestTooltip afterHide={afterHide} />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip(TOOLTIP_ID)

    unhoverAnchor(anchor, SHOW_TIMER_MS + 5)
    expect(tooltip).toHaveClass('react-tooltip__closing')

    // the show timer is still pending when the transition ends
    hoverAnchor(anchor)
    fireOpacityTransitionEnd(tooltip)
    advanceTimers(REMOVAL_MS)

    await expectTooltipToShow(tooltip)
    expect(afterHide).not.toHaveBeenCalled()
  })

  test('keeps a tooltip that is hovered again while closing, when its show timer and its removal timer run in the same turn', async () => {
    const afterHide = jest.fn()

    render(<TestTooltip afterHide={afterHide} />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip(TOOLTIP_ID)

    // long enough to stop showing, too short for the removal to come due
    unhoverAnchor(anchor, SHOW_TIMER_MS + 5)
    expect(tooltip).toHaveClass('react-tooltip__closing')

    hoverAnchor(anchor, REMOVAL_MS)

    await expectTooltipToShow(tooltip)
    expect(afterHide).not.toHaveBeenCalled()
  })

  test('keeps a tooltip that is hovered again while closing, when its show timer and its transition end run in the same turn', async () => {
    const afterHide = jest.fn()

    render(<TestTooltip afterHide={afterHide} />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip(TOOLTIP_ID)

    unhoverAnchor(anchor, SHOW_TIMER_MS + 5)
    expect(tooltip).toHaveClass('react-tooltip__closing')

    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(SHOW_TIMER_MS)
      fireOpacityTransitionEnd(tooltip)
    })
    advanceTimers(REMOVAL_MS)

    await expectTooltipToShow(tooltip)
    expect(afterHide).not.toHaveBeenCalled()
  })
})
