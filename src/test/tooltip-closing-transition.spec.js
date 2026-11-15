import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController } from '../components/TooltipController'
import {
  advanceTimers,
  flushPendingTimers,
  hoverAnchor,
  unhoverAnchor,
  waitForTooltip,
} from './test-utils'

jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => jest.fn()),
  }
})

const TOOLTIP_ID = 'closing-transition-test'
const getTooltip = () => document.getElementById(TOOLTIP_ID)

const showThenClose = async (tooltipProps) => {
  render(
    <>
      <span data-tooltip-id={TOOLTIP_ID}>Hover Me</span>
      <TooltipController id={TOOLTIP_ID} content="Closing Transition Test" {...tooltipProps} />
    </>,
  )

  const anchor = screen.getByText('Hover Me')
  hoverAnchor(anchor, 100)
  await waitForTooltip(TOOLTIP_ID)
  await waitFor(() => {
    expect(getTooltip()).toHaveClass('react-tooltip__show')
  })

  unhoverAnchor(anchor, 20)
  expect(getTooltip()).toHaveClass('react-tooltip__closing')
}

describe('tooltip closing transition', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    flushPendingTimers()
    jest.useRealTimers()
  })

  test('keeps a closing tooltip for its closing transition when it is longer than the show transition', async () => {
    await showThenClose({
      style: { '--rt-transition-show-delay': '0.15s', '--rt-transition-closing-delay': '0.6s' },
    })

    // half way through the 0.6s closing transition
    advanceTimers(300)
    expect(getTooltip()).toBeInTheDocument()

    // removed after it, even if no `transitionend` fires
    advanceTimers(400)
    expect(getTooltip()).not.toBeInTheDocument()
  })

  test('keeps a closing tooltip for its closing transition when the length is set on the tooltip', async () => {
    // nothing on body: the length is read where the transition runs
    await showThenClose({ style: { '--rt-transition-closing-delay': '0.6s' } })

    advanceTimers(300)
    expect(getTooltip()).toBeInTheDocument()

    advanceTimers(400)
    expect(getTooltip()).not.toBeInTheDocument()
  })
})
