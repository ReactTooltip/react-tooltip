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
})
