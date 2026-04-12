import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { autoUpdate } from '@floating-ui/dom'
import { TooltipController } from '../components/TooltipController'
import {
  advanceTimers,
  flushMicrotasks,
  flushPendingTimers,
  hoverAnchor,
  unhoverAnchor,
  waitForTooltip,
  waitForTooltipToStopShowing,
} from './test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn().mockImplementation((reference, floating, update) => {
      if (update) update()
      return jest.fn()
    }),
  }
})

describe('tooltip interaction behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    flushPendingTimers()
    jest.useRealTimers()
  })

  const renderAndFlush = async (ui) => {
    let view
    await act(async () => {
      view = render(ui)
      await Promise.resolve()
    })
    return view
  }

  test('opens on click when click is the configured trigger', async () => {
    await renderAndFlush(
      <>
        <span data-tooltip-id="click-only-test">Hover Me</span>
        <TooltipController
          id="click-only-test"
          content="Click Only Test"
          openEvents={{ click: true }}
          closeEvents={{ click: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 100)
    expect(document.getElementById('click-only-test')).not.toBeInTheDocument()

    fireEvent.click(anchor)
    await flushMicrotasks()
    const tooltip = await waitForTooltip('click-only-test')
    expect(tooltip).toHaveTextContent('Click Only Test')
  })

  test('stops showing after scroll and resize global close events', async () => {
    await renderAndFlush(
      <>
        <span data-tooltip-id="global-events-test">Hover Me</span>
        <TooltipController
          id="global-events-test"
          content="Global Events Test"
          globalCloseEvents={{ scroll: true, resize: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 1000)
    await waitForTooltip('global-events-test')

    fireEvent.scroll(window)
    await flushMicrotasks()
    await waitForTooltipToStopShowing('global-events-test')

    hoverAnchor(anchor, 1000)
    await waitForTooltip('global-events-test')

    fireEvent.resize(window)
    await flushMicrotasks()
    await waitForTooltipToStopShowing('global-events-test')
  })

  test('keeps a clickable tooltip open while the pointer moves into it', async () => {
    await renderAndFlush(
      <>
        <span data-tooltip-id="clickable-test">Hover Me</span>
        <TooltipController
          id="clickable-test"
          content="Clickable Test"
          clickable
          globalCloseEvents={{ scroll: true, resize: true }}
        />
      </>,
    )

    const anchor = screen.getByText('Hover Me')

    hoverAnchor(anchor, 1000)
    const tooltip = await waitForTooltip('clickable-test')

    unhoverAnchor(anchor, 0)
    fireEvent.mouseEnter(tooltip)
    await flushMicrotasks()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(tooltip)
    await flushMicrotasks()
    await waitForTooltipToStopShowing('clickable-test')
  })

  test('keeps autoUpdate wired when an active anchor is removed', async () => {
    const RemovableTest = () => {
      const [showAnchor, setShowAnchor] = useState(true)

      return (
        <div>
          {showAnchor && <span data-tooltip-id="removable-test">Hover Me</span>}
          <button onClick={() => setShowAnchor(false)}>Remove Anchor</button>
          <TooltipController id="removable-test" content="Removable Test" />
        </div>
      )
    }

    await renderAndFlush(<RemovableTest />)

    const anchor = screen.getByText('Hover Me')
    hoverAnchor(anchor, 500)
    await waitForTooltip('removable-test')

    fireEvent.click(screen.getByText('Remove Anchor'))
    await flushMicrotasks()

    await waitFor(() => {
      expect(screen.queryByText('Hover Me')).not.toBeInTheDocument()
    })
    expect(autoUpdate).toHaveBeenCalled()
  })

  test('opens without emitting runtime errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await renderAndFlush(
      <>
        <span data-tooltip-id="console-error-test">Hover Me</span>
        <TooltipController id="console-error-test" content="Console Error Test" />
      </>,
    )

    hoverAnchor(screen.getByText('Hover Me'), 500)
    await flushMicrotasks()

    expect(screen.getByText('Console Error Test')).toBeInTheDocument()
    consoleErrorSpy.mockRestore()
  })

  test('ignores missing pointermove events in float mode', () => {
    const originalAddEventListener = HTMLSpanElement.prototype.addEventListener
    const listenerRegistry = []

    const addEventListenerSpy = jest
      .spyOn(HTMLSpanElement.prototype, 'addEventListener')
      .mockImplementation(function mockAddEventListener(event, listener, options) {
        listenerRegistry.push({ target: this, event, listener })
        return originalAddEventListener.call(this, event, listener, options)
      })

    render(
      <>
        <span data-tooltip-id="float-guard-test">Hover Me</span>
        <TooltipController id="float-guard-test" content="Float Guard Test" float />
      </>,
    )

    const pointerMoveListener = listenerRegistry.find(
      ({ target, event }) => target.textContent === 'Hover Me' && event === 'pointermove',
    )?.listener

    expect(() => {
      act(() => {
        pointerMoveListener?.()
      })
    }).not.toThrow()

    addEventListenerSpy.mockRestore()
  })

  test('ignores missing open events before an anchor is resolved', () => {
    const originalAddEventListener = HTMLSpanElement.prototype.addEventListener
    const listenerRegistry = []

    const addEventListenerSpy = jest
      .spyOn(HTMLSpanElement.prototype, 'addEventListener')
      .mockImplementation(function mockAddEventListener(event, listener, options) {
        listenerRegistry.push({ target: this, event, listener })
        return originalAddEventListener.call(this, event, listener, options)
      })

    render(
      <>
        <span data-tooltip-id="missing-open-event-test">Hover Me</span>
        <TooltipController id="missing-open-event-test" content="Missing Open Event Test" />
      </>,
    )

    const mouseEnterListener = listenerRegistry.find(
      ({ target, event }) => target.textContent === 'Hover Me' && event === 'mouseenter',
    )?.listener

    expect(() => {
      act(() => {
        mouseEnterListener?.()
      })
      advanceTimers(60)
    }).not.toThrow()
    expect(document.getElementById('missing-open-event-test')).not.toBeInTheDocument()

    addEventListenerSpy.mockRestore()
  })

  test('ignores disconnected anchors during open handling', () => {
    const originalAddEventListener = window.EventTarget.prototype.addEventListener
    const listenerRegistry = []

    const addEventListenerSpy = jest
      .spyOn(window.EventTarget.prototype, 'addEventListener')
      .mockImplementation(function mockAddEventListener(event, listener, options) {
        listenerRegistry.push({ target: this, event, listener })
        return originalAddEventListener.call(this, event, listener, options)
      })

    render(
      <>
        <span data-tooltip-id="anchor-guards-test">Hover Me</span>
        <TooltipController id="anchor-guards-test" content="Anchor Guards Test" />
      </>,
    )

    const mouseEnterListener = listenerRegistry.find(
      ({ target, event }) => target.textContent === 'Hover Me' && event === 'mouseenter',
    )?.listener
    expect(mouseEnterListener).toBeDefined()

    const detachedAnchor = document.createElement('span')
    detachedAnchor.textContent = 'Detached Anchor'

    act(() => {
      mouseEnterListener({
        currentTarget: detachedAnchor,
        target: detachedAnchor,
      })
    })
    advanceTimers(60)

    expect(document.getElementById('anchor-guards-test')).not.toBeInTheDocument()

    addEventListenerSpy.mockRestore()
  })
})
