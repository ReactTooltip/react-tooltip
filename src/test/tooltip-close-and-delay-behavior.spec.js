import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
import { installMockMutationObserver } from './mutation-observer-test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

describe('tooltip close and delay behavior', () => {
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

  test('ignores unsupported custom DOM events', async () => {
    render(
      <>
        <span data-tooltip-id="custom-events-test">Hover Me</span>
        <TooltipController
          id="custom-events-test"
          content="Custom Events Test"
          openEvents={{ customopen: true }}
          closeEvents={{ customclose: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    anchor.dispatchEvent(new Event('customopen', { bubbles: true }))
    advanceTimers(50)
    expect(document.getElementById('custom-events-test')).not.toBeInTheDocument()
  })

  test('closes a clickable tooltip after leaving its content', async () => {
    render(
      <>
        <span data-tooltip-id="clickable-no-click-test">Hover Me</span>
        <TooltipController
          id="clickable-no-click-test"
          content="Clickable No Click Test"
          clickable
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip('clickable-no-click-test')

    unhoverAnchor(anchor)
    fireEvent.mouseEnter(tooltip)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(tooltip)
    await waitForTooltipToClose('clickable-no-click-test')
  })

  test('stays stable when anchorSelect matches are removed', () => {
    const SelectorWithRemovedNodesTest = () => {
      const [showElement, setShowElement] = useState(true)

      return (
        <div>
          {showElement && (
            <div className="selector-container">
              <span className="selector-target">Target Element</span>
            </div>
          )}
          <button onClick={() => setShowElement(false)}>Remove Element</button>
          <TooltipController
            id="selector-removed-nodes-test"
            content="Selector Removed Nodes Test"
            anchorSelect=".selector-target"
          />
        </div>
      )
    }

    const { container } = render(<SelectorWithRemovedNodesTest />)

    expect(container.querySelector('.selector-target')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Remove Element'))
    mutationObserverController.triggerAll([
      {
        type: 'childList',
        removedNodes: [],
        addedNodes: [],
      },
    ])
    expect(container.querySelector('.selector-target')).not.toBeInTheDocument()
  })

  test('closes on Escape when configured globally', async () => {
    render(
      <>
        <span data-tooltip-id="escape-key-test">Hover Me</span>
        <TooltipController
          id="escape-key-test"
          content="Escape Key Test"
          globalCloseEvents={{ escape: true }}
        />
      </>,
    )

    hoverAnchor(screen.getByText('Hover Me'), 100)
    await waitForTooltip('escape-key-test')

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitForTooltipToClose('escape-key-test')
  })

  test('closes on outside click when configured', async () => {
    render(
      <>
        <span data-tooltip-id="click-outside-test">Hover Me</span>
        <button>Outside</button>
        <TooltipController
          id="click-outside-test"
          content="Click Outside Test"
          globalCloseEvents={{ clickOutsideAnchor: true }}
        />
      </>,
    )

    hoverAnchor(screen.getByText('Hover Me'), 100)
    await waitForTooltip('click-outside-test')

    fireEvent.click(screen.getByText('Outside'))
    await waitForTooltipToClose('click-outside-test')
  })

  test('applies delayShow and delayHide before visibility changes', async () => {
    render(
      <>
        <span data-tooltip-id="debounced-test">Hover Me</span>
        <TooltipController
          id="debounced-test"
          content="Debounced Test"
          delayShow={50}
          delayHide={50}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor)
    expect(document.getElementById('debounced-test')).not.toBeInTheDocument()

    advanceTimers(100)
    await waitForTooltip('debounced-test')

    unhoverAnchor(anchor)
    expect(document.getElementById('debounced-test')).toBeInTheDocument()

    advanceTimers(100)
    await waitForTooltipToClose('debounced-test')
  })

  test('restarts the pending show timer when hover is retriggered', async () => {
    render(
      <>
        <span data-tooltip-id="retriggered-delay-test">Hover Me</span>
        <TooltipController
          id="retriggered-delay-test"
          content="Retriggered Delay Test"
          delayShow={100}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor)
    advanceTimers(60)
    hoverAnchor(anchor)
    advanceTimers(90)
    expect(document.getElementById('retriggered-delay-test')).not.toBeInTheDocument()

    advanceTimers(30)
    await waitForTooltip('retriggered-delay-test')
  })

  test('keeps a clickable tooltip open when the hide delay expires while hovering it', async () => {
    render(
      <>
        <span data-tooltip-id="clickable-delay-hide-test">Hover Me</span>
        <TooltipController
          id="clickable-delay-hide-test"
          content="Clickable Delay Hide Test"
          clickable
          delayHide={50}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip('clickable-delay-hide-test')

    unhoverAnchor(anchor)
    fireEvent.mouseEnter(tooltip)
    advanceTimers(60)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(tooltip)
    advanceTimers(60)
    await waitForTooltipToClose('clickable-delay-hide-test')
  })

  test('clears a pending hide delay when the anchor is hovered again', async () => {
    render(
      <>
        <span data-tooltip-id="rehydrated-hide-delay-test">Hover Me</span>
        <TooltipController
          id="rehydrated-hide-delay-test"
          content="Rehydrated Hide Delay Test"
          delayHide={100}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    await waitForTooltip('rehydrated-hide-delay-test')

    unhoverAnchor(anchor)
    advanceTimers(40)
    hoverAnchor(anchor)
    advanceTimers(80)

    expect(document.getElementById('rehydrated-hide-delay-test')).toBeInTheDocument()
  })

  test('closes automatically after the configured time while still hovering the anchor', async () => {
    render(
      <>
        <span data-tooltip-id="auto-close-test">Hover Me</span>
        <TooltipController id="auto-close-test" content="Auto Close Test" autoClose={5000} />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    await waitForTooltip('auto-close-test')

    advanceTimers(4900)
    expect(document.getElementById('auto-close-test')).toBeInTheDocument()

    advanceTimers(200)
    await waitForTooltipToClose('auto-close-test')
  })

  test('restarts the auto-close timer when the active anchor changes', async () => {
    render(
      <>
        <span data-tooltip-id="auto-close-reset-test">First Anchor</span>
        <span data-tooltip-id="auto-close-reset-test">Second Anchor</span>
        <TooltipController
          id="auto-close-reset-test"
          content="Auto Close Reset Test"
          autoClose={5000}
        />
      </>,
    )

    const firstAnchor = screen.getByText('First Anchor')
    const secondAnchor = screen.getByText('Second Anchor')

    hoverAnchor(firstAnchor, 100)
    await waitForTooltip('auto-close-reset-test')

    advanceTimers(3000)
    hoverAnchor(secondAnchor, 100)

    advanceTimers(3000)
    expect(document.getElementById('auto-close-reset-test')).toBeInTheDocument()

    advanceTimers(2200)
    await waitForTooltipToClose('auto-close-reset-test')
  })

  test('cancels a pending show timer when the anchor hides first', () => {
    render(
      <>
        <span data-tooltip-id="cancel-show-timer-test">Hover Me</span>
        <TooltipController
          id="cancel-show-timer-test"
          content="Cancel Show Timer Test"
          delayShow={100}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor)
    advanceTimers(40)
    unhoverAnchor(anchor)
    advanceTimers(100)

    expect(document.getElementById('cancel-show-timer-test')).not.toBeInTheDocument()
  })

  test('does not close on non-Escape keys', async () => {
    render(
      <>
        <span data-tooltip-id="non-escape-key-test">Hover Me</span>
        <TooltipController
          id="non-escape-key-test"
          content="Non-Escape Key Test"
          globalCloseEvents={{ escape: true }}
        />
      </>,
    )

    hoverAnchor(screen.getByText('Hover Me'), 100)
    await waitForTooltip('non-escape-key-test')

    fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' })
    expect(document.getElementById('non-escape-key-test')).toBeInTheDocument()
  })

  test('ignores outside-click close events for disconnected targets and tooltip clicks', async () => {
    render(
      <>
        <span data-tooltip-id="outside-click-guards-test">Hover Me</span>
        <TooltipController
          id="outside-click-guards-test"
          content="Outside Click Guards Test"
          globalCloseEvents={{ clickOutsideAnchor: true }}
        />
      </>,
    )

    hoverAnchor(screen.getByText('Hover Me'), 100)
    const tooltip = await waitForTooltip('outside-click-guards-test')

    const disconnectedTarget = document.createElement('button')
    const disconnectedClick = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(disconnectedClick, 'target', { value: disconnectedTarget })
    fireEvent(window, disconnectedClick)
    expect(document.getElementById('outside-click-guards-test')).toBeInTheDocument()

    fireEvent.click(tooltip)
    expect(document.getElementById('outside-click-guards-test')).toBeInTheDocument()
  })

  test('completes the hide flow on opacity transition end', async () => {
    const afterHide = jest.fn()

    render(
      <>
        <span data-tooltip-id="transition-end-test">Hover Me</span>
        <TooltipController
          id="transition-end-test"
          content="Transition End Test"
          afterHide={afterHide}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip('transition-end-test')

    unhoverAnchor(anchor, 20)
    expect(tooltip).toHaveClass('react-tooltip__closing')

    const transitionEndEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'opacity' })
    fireEvent(tooltip, transitionEndEvent)
    await waitForTooltipToClose('transition-end-test')
    expect(afterHide).toHaveBeenCalledTimes(1)
  })

  test('ignores transition end events for unrelated CSS properties', async () => {
    render(
      <>
        <span data-tooltip-id="transition-property-guard-test">Hover Me</span>
        <TooltipController
          id="transition-property-guard-test"
          content="Transition Property Guard Test"
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    const tooltip = await waitForTooltip('transition-property-guard-test')

    unhoverAnchor(anchor, 20)
    expect(tooltip).toHaveClass('react-tooltip__closing')

    const transitionEndEvent = new Event('transitionend', { bubbles: true })
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'transform' })
    fireEvent(tooltip, transitionEndEvent)

    expect(document.getElementById('transition-property-guard-test')).toBeInTheDocument()
  })
})
