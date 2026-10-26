import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController } from '../components/TooltipController'
import { resetFocusOpenGuards } from '../components/Tooltip/focus-open'
import { flushPendingTimers, waitForTooltip, waitForTooltipToStopShowing } from './test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

function describedBy(anchor) {
  return anchor.getAttribute('aria-describedby') ?? ''
}

const originalMatches = Element.prototype.matches
const navigatorSpies = []

function installBrowserFocusVisible(focusVisible) {
  navigatorSpies.push(
    jest
      .spyOn(navigator, 'userAgent', 'get')
      .mockReturnValue(
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      ),
  )
  Element.prototype.matches = function matches(selector) {
    if (selector === ':focus-visible') {
      return focusVisible(this)
    }
    return originalMatches.call(this, selector)
  }
}

function installMacSafari() {
  navigatorSpies.push(
    jest
      .spyOn(navigator, 'userAgent', 'get')
      .mockReturnValue(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
      ),
    jest.spyOn(navigator, 'vendor', 'get').mockReturnValue('Apple Computer, Inc.'),
    jest.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel'),
  )
}

function restoreBrowserFocusVisible() {
  Element.prototype.matches = originalMatches
  navigatorSpies.splice(0).forEach((spy) => spy.mockRestore())
}

function renderTip({ id, openEvents, children }) {
  render(
    <>
      {children}
      <TooltipController id={id} content="Select model" openEvents={openEvents} />
    </>,
  )
}

function focusAndFlush(anchor, init) {
  act(() => {
    fireEvent.focus(anchor, init)
    jest.advanceTimersByTime(30)
  })
}

describe('tooltip focus visibility', () => {
  beforeEach(() => {
    resetFocusOpenGuards()
    jest.useFakeTimers()
  })

  afterEach(() => {
    restoreBrowserFocusVisible()
    resetFocusOpenGuards()
    flushPendingTimers()
    jest.useRealTimers()
  })

  test('does not open when the browser restores focus after the window blurs', async () => {
    renderTip({
      id: 'restore-focus',
      children: (
        <button type="button" data-tooltip-id="restore-focus">
          Model
        </button>
      ),
    })

    const anchor = screen.getByRole('button', { name: 'Model' })

    act(() => {
      anchor.focus()
    })
    await waitForTooltip('restore-focus')
    act(() => {
      jest.advanceTimersByTime(30)
    })
    expect(describedBy(anchor)).toContain('restore-focus')

    act(() => {
      fireEvent.mouseOut(anchor, { relatedTarget: document.body })
    })
    await waitForTooltipToStopShowing('restore-focus')
    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(describedBy(anchor)).not.toContain('restore-focus')
    expect(document.activeElement).toBe(anchor)

    act(() => {
      window.dispatchEvent(new Event('blur'))
      window.dispatchEvent(new Event('focus'))
      fireEvent.focus(anchor)
      jest.advanceTimersByTime(30)
    })

    expect(describedBy(anchor)).not.toContain('restore-focus')
  })

  test('does not keep blocking focus when the window never fires focus', async () => {
    renderTip({
      id: 'restore-no-window-focus',
      children: (
        <button type="button" data-tooltip-id="restore-no-window-focus">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    act(() => {
      anchor.focus()
    })
    await waitForTooltip('restore-no-window-focus')
    act(() => {
      fireEvent.mouseOut(anchor, { relatedTarget: document.body })
      jest.runOnlyPendingTimers()
    })

    act(() => {
      window.dispatchEvent(new Event('blur'))
      fireEvent.focus(anchor)
      jest.advanceTimersByTime(30)
    })
    expect(describedBy(anchor)).not.toContain('restore-no-window-focus')

    focusAndFlush(anchor)
    expect(describedBy(anchor)).toContain('restore-no-window-focus')
  })

  test('stops ignoring the anchor after focus moves somewhere else', async () => {
    renderTip({
      id: 'restore-moved',
      children: (
        <>
          <button type="button" data-tooltip-id="restore-moved">
            Model
          </button>
          <button type="button">Other</button>
        </>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })
    const other = screen.getByRole('button', { name: 'Other' })

    act(() => {
      anchor.focus()
    })
    await waitForTooltip('restore-moved')
    act(() => {
      fireEvent.mouseOut(anchor, { relatedTarget: document.body })
      jest.runOnlyPendingTimers()
    })

    act(() => {
      window.dispatchEvent(new Event('blur'))
      other.focus()
      jest.runOnlyPendingTimers()
    })

    focusAndFlush(anchor)
    expect(describedBy(anchor)).toContain('restore-moved')
  })

  test('opens on a later focus after an ignored window restore', async () => {
    renderTip({
      id: 'restore-later',
      children: (
        <button type="button" data-tooltip-id="restore-later">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    act(() => {
      anchor.focus()
    })
    await waitForTooltip('restore-later')
    act(() => {
      fireEvent.mouseOut(anchor, { relatedTarget: document.body })
      jest.runOnlyPendingTimers()
    })

    act(() => {
      window.dispatchEvent(new Event('blur'))
      window.dispatchEvent(new Event('focus'))
      fireEvent.focus(anchor)
      jest.runOnlyPendingTimers()
    })
    expect(describedBy(anchor)).not.toContain('restore-later')

    focusAndFlush(anchor)
    expect(describedBy(anchor)).toContain('restore-later')
  })

  test('does not open when programmatic focus is not :focus-visible', () => {
    installBrowserFocusVisible(() => false)
    renderTip({
      id: 'programmatic-focus',
      children: (
        <button type="button" data-tooltip-id="programmatic-focus">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    focusAndFlush(anchor)

    expect(describedBy(anchor)).not.toContain('programmatic-focus')
  })

  test('opens for keyboard focus that matches :focus-visible', () => {
    installBrowserFocusVisible(() => true)
    renderTip({
      id: 'keyboard-focus',
      children: (
        <button type="button" data-tooltip-id="keyboard-focus">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    focusAndFlush(anchor)

    expect(describedBy(anchor)).toContain('keyboard-focus')
  })

  test('opens for :focus-visible on a control inside the anchor', () => {
    installBrowserFocusVisible((element) => element.tagName === 'BUTTON')
    renderTip({
      id: 'inner-focus',
      children: (
        <div data-tooltip-id="inner-focus">
          Wrapper
          <button type="button">Inner</button>
        </div>
      ),
    })
    const anchor = screen.getByText('Wrapper').closest('div')
    const inner = screen.getByRole('button', { name: 'Inner' })

    focusAndFlush(inner)

    expect(describedBy(anchor)).toContain('inner-focus')
  })

  test('openEvents focus true still opens when focus is not :focus-visible', () => {
    installBrowserFocusVisible(() => false)
    renderTip({
      id: 'any-focus',
      openEvents: { focus: true },
      children: (
        <button type="button" data-tooltip-id="any-focus">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    focusAndFlush(anchor)

    expect(describedBy(anchor)).toContain('any-focus')
  })

  test("openEvents focus 'visible' does not open on programmatic focus", () => {
    installBrowserFocusVisible(() => false)
    renderTip({
      id: 'visible-focus',
      openEvents: { focus: 'visible', mouseenter: true },
      children: (
        <button type="button" data-tooltip-id="visible-focus">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    focusAndFlush(anchor)

    expect(describedBy(anchor)).not.toContain('visible-focus')
  })

  test('Mac Safari ignores pointer focus from outside the document', () => {
    installMacSafari()
    renderTip({
      id: 'safari-pointer',
      children: (
        <button type="button" data-tooltip-id="safari-pointer">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    act(() => {
      fireEvent.pointerDown(anchor)
    })
    focusAndFlush(anchor, { relatedTarget: null })

    expect(describedBy(anchor)).not.toContain('safari-pointer')
  })

  test('Mac Safari opens keyboard focus from outside the document', () => {
    installMacSafari()
    renderTip({
      id: 'safari-key',
      children: (
        <button type="button" data-tooltip-id="safari-key">
          Model
        </button>
      ),
    })
    const anchor = screen.getByRole('button', { name: 'Model' })

    act(() => {
      fireEvent.keyDown(anchor, { key: 'Tab' })
    })
    focusAndFlush(anchor, { relatedTarget: null })

    expect(describedBy(anchor)).toContain('safari-key')
  })

  test('Mac Safari still opens pointer focus on a text field', () => {
    installMacSafari()
    renderTip({
      id: 'safari-input',
      children: <input aria-label="Name" data-tooltip-id="safari-input" />,
    })
    const anchor = screen.getByRole('textbox', { name: 'Name' })

    act(() => {
      fireEvent.pointerDown(anchor)
    })
    focusAndFlush(anchor, { relatedTarget: null })

    expect(describedBy(anchor)).toContain('safari-input')
  })
})
