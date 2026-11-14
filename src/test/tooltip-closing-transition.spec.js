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

// Its own file: the removal reads the transition lengths once per page,
// so they are set before any tooltip closes.
const TOOLTIP_ID = 'closing-transition-test'
const getTooltip = () => document.getElementById(TOOLTIP_ID)

describe('tooltip closing transition', () => {
  beforeAll(() => {
    document.body.style.setProperty('--rt-transition-show-delay', '0.15s')
    document.body.style.setProperty('--rt-transition-closing-delay', '0.6s')
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    flushPendingTimers()
    jest.useRealTimers()
  })

  test('keeps a closing tooltip for its closing transition when it is longer than the show transition', async () => {
    render(
      <>
        <span data-tooltip-id={TOOLTIP_ID}>Hover Me</span>
        <TooltipController id={TOOLTIP_ID} content="Closing Transition Test" />
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
    // half way through the 0.6s closing transition
    advanceTimers(300)
    expect(getTooltip()).toBeInTheDocument()

    // removed after it, even if no `transitionend` fires
    advanceTimers(400)
    expect(getTooltip()).not.toBeInTheDocument()
  })
})
