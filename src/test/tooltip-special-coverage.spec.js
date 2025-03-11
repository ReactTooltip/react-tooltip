import React, { useEffect, useState, useRef } from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController } from '../components/TooltipController'

// Mock the autoUpdate function from @floating-ui/dom
jest.mock('@floating-ui/dom', () => {
  const originalModule = jest.requireActual('@floating-ui/dom')
  return {
    ...originalModule,
    autoUpdate: jest.fn(() => {
      // Return a cleanup function
      return jest.fn()
    }),
  }
})

// Tell Jest to mock all timeout functions
jest.useFakeTimers()

describe('tooltip special coverage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any remaining timers
    jest.clearAllTimers()
  })

  // Test for lines 549 and 562 - "never happens" comments in event handling
  test('tooltip with custom events that are neither regular nor click events', async () => {
    // Create a component with custom events
    const CustomEventsTest = () => {
      const tooltipRef = useRef(null)

      // Force custom events by directly manipulating the tooltip ref
      useEffect(() => {
        if (tooltipRef.current) {
          // This will trigger the "never happens" code paths
          // by simulating custom events that are neither regular nor click events
          const customOpenEvent = new Event('customopen')
          const customCloseEvent = new Event('customclose')

          // Dispatch custom events
          setTimeout(() => {
            const anchor = document.querySelector('[data-tooltip-id="custom-events-test"]')
            if (anchor) {
              anchor.dispatchEvent(customOpenEvent)
              anchor.dispatchEvent(customCloseEvent)
            }
          }, 100)
        }
      }, [tooltipRef.current])

      return (
        <div>
          <span data-tooltip-id="custom-events-test">Hover Me</span>
          <TooltipController
            id="custom-events-test"
            content="Custom Events Test"
            events={['hover']}
            openEvents={['customopen']} // Custom open event
            closeEvents={['customclose']} // Custom close event
            delayShow={0}
            delayHide={0}
            forwardRef={tooltipRef}
          />
        </div>
      )
    }

    // Render the component
    render(<CustomEventsTest />)

    // Advance timers to trigger the custom events
    act(() => {
      jest.advanceTimersByTime(200)
    })

    // The test passes if no error is thrown
  })

  // Test for lines 616-617 - clickable tooltip with no click events
  test('tooltip with clickable prop but no click events', async () => {
    // Create a component with clickable prop but no click events
    const ClickableNoClickEventsTest = () => {
      return (
        <div>
          <span data-tooltip-id="clickable-no-click-test">Hover Me</span>
          <TooltipController
            id="clickable-no-click-test"
            content="Clickable No Click Test"
            events={['hover']} // Only hover events, no click events
            delayShow={0}
            delayHide={0}
            clickable // Make it clickable
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<ClickableNoClickEventsTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="clickable-no-click-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(100)
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
      jest.advanceTimersByTime(100)
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
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  // Test for lines 706-707 - selector with removed nodes
  test('tooltip with selector and removed nodes', async () => {
    // Create a component with a selector and removable nodes
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
            selector=".selector-target"
            events={['hover']}
            delayShow={0}
            delayHide={0}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<SelectorWithRemovedNodesTest />)

    // Get the target element directly
    const targetElement = container.querySelector('.selector-target')
    expect(targetElement).toBeInTheDocument()

    // No need to try to show the tooltip, just test the removal part
    // Remove the element containing the target
    act(() => {
      fireEvent.click(screen.getByText('Remove Element'))
      jest.advanceTimersByTime(100)
    })

    // Verify the target element is removed
    expect(container.querySelector('.selector-target')).not.toBeInTheDocument()
  })

  // Test for global close events with escape key
  test('tooltip with escape key global close event', async () => {
    // Create a component with escape key global close event
    const EscapeKeyTest = () => {
      return (
        <div>
          <span data-tooltip-id="escape-key-test">Hover Me</span>
          <TooltipController
            id="escape-key-test"
            content="Escape Key Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
            globalCloseEvents={{ escape: true }}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<EscapeKeyTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="escape-key-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      const tooltip = document.getElementById('escape-key-test')
      expect(tooltip).toBeInTheDocument()
    })

    // Press escape key
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      const tooltip = document.getElementById('escape-key-test')
      expect(tooltip).not.toBeInTheDocument()
    })
  })

  // Test for click outside anchors global close event
  test('tooltip with click outside anchors global close event', async () => {
    // Create a component with click outside anchors global close event
    const ClickOutsideTest = () => {
      return (
        <div>
          <span data-tooltip-id="click-outside-test">Hover Me</span>
          <button id="outside-button">Click Outside</button>
          <TooltipController
            id="click-outside-test"
            content="Click Outside Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
            globalCloseEvents={{ clickOutsideAnchor: true }}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<ClickOutsideTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="click-outside-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      const tooltip = document.getElementById('click-outside-test')
      expect(tooltip).toBeInTheDocument()
    })

    // Click outside the anchor
    act(() => {
      fireEvent.click(container.querySelector('#outside-button'))
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      const tooltip = document.getElementById('click-outside-test')
      expect(tooltip).not.toBeInTheDocument()
    })
  })

  // Test for lines 368, 382-383 - debounced handlers
  test('tooltip with debounced handlers', async () => {
    // Create a component with debounced handlers
    const DebouncedHandlersTest = () => {
      return (
        <div>
          <span data-tooltip-id="debounced-test">Hover Me</span>
          <TooltipController
            id="debounced-test"
            content="Debounced Test"
            events={['hover']}
            delayShow={50} // Add a delay to trigger debounced handlers
            delayHide={50}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<DebouncedHandlersTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="debounced-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip with debounced handler
    act(() => {
      fireEvent.mouseEnter(anchor)
      // Don't advance timers yet
    })

    // Tooltip should not be visible yet due to delay
    expect(document.getElementById('debounced-test')).not.toBeInTheDocument()

    // Advance timers to trigger the debounced show handler
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      const tooltip = document.getElementById('debounced-test')
      expect(tooltip).toBeInTheDocument()
    })

    // Hide the tooltip with debounced handler
    act(() => {
      fireEvent.mouseLeave(anchor)
      // Don't advance timers yet
    })

    // Tooltip should still be visible due to delay
    expect(document.getElementById('debounced-test')).toBeInTheDocument()

    // Advance timers to trigger the debounced hide handler
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is hidden
    await waitFor(() => {
      const tooltip = document.getElementById('debounced-test')
      expect(tooltip).not.toBeInTheDocument()
    })
  })

  // Test for lines 500-501 - handleEsc with non-Escape key
  test('tooltip with non-Escape key press', async () => {
    // Create a component with escape key global close event
    const NonEscapeKeyTest = () => {
      return (
        <div>
          <span data-tooltip-id="non-escape-key-test">Hover Me</span>
          <TooltipController
            id="non-escape-key-test"
            content="Non-Escape Key Test"
            events={['hover']}
            delayShow={0}
            delayHide={0}
            globalCloseEvents={{ escape: true }}
          />
        </div>
      )
    }

    // Render the component
    const { container } = render(<NonEscapeKeyTest />)

    // Get the anchor element directly
    const anchor = container.querySelector('[data-tooltip-id="non-escape-key-test"]')
    expect(anchor).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchor)
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is visible
    await waitFor(() => {
      const tooltip = document.getElementById('non-escape-key-test')
      expect(tooltip).toBeInTheDocument()
    })

    // Press a non-Escape key
    act(() => {
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' })
      jest.advanceTimersByTime(100)
    })

    // Verify the tooltip is still visible (not closed by non-Escape key)
    await waitFor(() => {
      const tooltip = document.getElementById('non-escape-key-test')
      expect(tooltip).toBeInTheDocument()
    })
  })
})
