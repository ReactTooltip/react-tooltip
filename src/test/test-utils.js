import React from 'react'
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react'
import { TooltipController } from '../components/TooltipController'

export function advanceTimers(ms = 0) {
  act(() => {
    jest.advanceTimersByTime(ms)
  })
}

export function flushPendingTimers() {
  act(() => {
    jest.runOnlyPendingTimers()
  })
}

export async function flushMicrotasks() {
  await act(async () => {
    await Promise.resolve()
  })
}

export function fireWithTimers(callback, ms = 0) {
  act(() => {
    callback()
    if (ms) {
      jest.advanceTimersByTime(ms)
    }
  })
}

export function hoverAnchor(anchor, ms = 0) {
  fireWithTimers(() => {
    fireEvent.mouseEnter(anchor)
  }, ms)
}

export function unhoverAnchor(anchor, ms = 0) {
  fireWithTimers(() => {
    fireEvent.mouseLeave(anchor)
  }, ms)
}

export function clickAnchor(anchor, ms = 0) {
  fireWithTimers(() => {
    fireEvent.click(anchor)
  }, ms)
}

export async function waitForTooltip(id) {
  await waitFor(() => {
    expect(document.getElementById(id)).toBeInTheDocument()
  })
  return document.getElementById(id)
}

export async function waitForTooltipToClose(id) {
  await waitFor(() => {
    expect(document.getElementById(id)).not.toBeInTheDocument()
  })
}

export async function waitForTooltipToStopShowing(id) {
  await waitFor(() => {
    const tooltip = document.getElementById(id)
    expect(tooltip === null || tooltip.classList.contains('react-tooltip__closing')).toBe(true)
  })
}

export function renderTooltip({
  id = 'test-tooltip',
  anchorText = 'Hover Me',
  anchorProps = {},
  tooltipProps = {},
  anchor = <span data-tooltip-id={id}>{anchorText}</span>,
} = {}) {
  const view = render(
    <>
      {React.isValidElement(anchor)
        ? React.cloneElement(anchor, {
            'data-tooltip-id': anchor.props['data-tooltip-id'] ?? id,
            ...anchorProps,
          })
        : anchor}
      <TooltipController id={id} content={`${id} content`} {...tooltipProps} />
    </>,
  )

  const getAnchor = () =>
    anchorProps['aria-label']
      ? screen.getByLabelText(anchorProps['aria-label'])
      : screen.getByText(anchorText)

  return {
    ...view,
    id,
    getAnchor,
  }
}
