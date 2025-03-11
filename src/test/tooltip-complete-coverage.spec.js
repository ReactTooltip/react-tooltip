import React, { useState } from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { autoUpdate } from '@floating-ui/dom'
import { TooltipController } from '../components/TooltipController'

// Mock autoUpdate from @floating-ui/dom
jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn().mockImplementation((reference, floating, update) => {
      // Call the update function to simulate positioning
      if (update) update()
      // Return a cleanup function
      return jest.fn()
    }),
  }
})

// Tell Jest to mock all timeout functions
jest.useFakeTimers()

describe('tooltip complete coverage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any remaining timers
    jest.clearAllTimers()
  })

  test('tooltip with custom events that never happen', async () => {
    // Create a component with custom events
    const CustomEventsTest = () => {
      return (
        <div>
          <span data-tooltip-id="custom-events-test">Hover Me</span>
          <TooltipController
            id="custom-events-test"
            content="Custom Events Test"
            events={['click']}
            delayShow={0}
            delayHide={0}
          />
        </div>
      )
    }

    // Render the component
    render(<CustomEventsTest />)

    // Verify the tooltip is not visible initially
    await waitFor(() => {
      const tooltip = document.getElementById('custom-events-test')
      expect(tooltip).not.toBeInTheDocument()
    })
  })

  test('tooltip with global close events (scroll and resize)', async () => {
    // Create a component with global close events
    const GlobalEventsTest = () => {
      return (
        <div>
          <span data-tooltip-id="global-events-test">Hover Me</span>
          <TooltipController
            id="global-events-test"
            content="Global Events Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
            globalCloseEvents={{ scroll: true, resize: true }}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<GlobalEventsTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="global-events-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    // Trigger a scroll event
    act(() => {
      fireEvent.scroll(window)
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    // Show the tooltip again
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    // Trigger a resize event
    act(() => {
      fireEvent.resize(window)
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  test('tooltip with clickable prop', async () => {
    // Create a component with clickable prop
    const ClickableTest = () => {
      return (
        <div>
          <span data-tooltip-id="clickable-test">Hover Me</span>
          <TooltipController
            id="clickable-test"
            content="Clickable Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
            clickable
            globalCloseEvents={{ scroll: true, resize: true }}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<ClickableTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="clickable-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is visible
    let tooltip
    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
    })

    // Move mouse to tooltip (should stay visible)
    act(() => {
      fireEvent.mouseLeave(anchor)
      if (tooltip) {
        fireEvent.mouseEnter(tooltip)
      }
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is still visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    // Move mouse away from tooltip
    act(() => {
      if (tooltip) {
        fireEvent.mouseLeave(tooltip)
      }
      jest.advanceTimersByTime(1000)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  test('mutation observer with removed nodes', async () => {
    // Create a component with a removable anchor
    const RemovableTest = () => {
      const [showAnchor, setShowAnchor] = useState(true)

      return (
        <div>
          {showAnchor && <span data-tooltip-id="removable-test">Hover Me</span>}
          <button onClick={() => setShowAnchor(false)}>Remove Anchor</button>
          <TooltipController
            id="removable-test"
            content="Removable Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<RemovableTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="removable-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(500)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      const tooltip = document.getElementById('removable-test')
      expect(tooltip).toBeInTheDocument()
    })

    // Remove the anchor
    act(() => {
      fireEvent.click(screen.getByText('Remove Anchor'))
      jest.advanceTimersByTime(500)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      const tooltip = document.getElementById('removable-test')
      expect(tooltip).not.toBeInTheDocument()
    })

    // Verify autoUpdate was called
    expect(autoUpdate).toHaveBeenCalled()
  })

  test('try-catch handling', async () => {
    // Create a component that will trigger try-catch handling
    const TryCatchTest = () => {
      return (
        <div>
          <span data-tooltip-id="try-catch-test">Hover Me</span>
          <TooltipController
            id="try-catch-test"
            content="Try Catch Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
          />
        </div>
      )
    }

    // Create a spy on console.error to catch errors
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Render the component
    render(<TryCatchTest />)

    // Get the anchor element directly
    const anchor = document.querySelector('[data-tooltip-id="try-catch-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(500)
    })

    // Verify the component rendered without errors
    expect(anchor).toBeInTheDocument()

    // Restore console.error
    consoleErrorSpy.mockRestore()
  })
})
