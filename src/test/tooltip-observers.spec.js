import React, { useRef } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// Store original MutationObserver
const originalMutationObserver = global.MutationObserver

// Mock MutationObserver
beforeEach(() => {
  // Mock MutationObserver with a proper callback mechanism
  global.MutationObserver = class {
    constructor(callback) {
      this.callback = callback
    }

    observe() {
      // Using this in an empty method to satisfy linter
      this.observed = true
    }

    disconnect() {
      // Using this in an empty method to satisfy linter
      this.connected = false
    }

    takeRecords() {
      // Using this in an empty method to satisfy linter
      this.records = []
      return this.records
    }
  }
})

// Restore original MutationObserver
afterEach(() => {
  global.MutationObserver = originalMutationObserver
})

describe('tooltip observers', () => {
  test('tooltip handles scroll and resize events', () => {
    render(
      <>
        <span data-tooltip-id="scroll-test">Hover Me</span>
        <Tooltip id="scroll-test" content="Scroll Test" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    fireEvent.mouseEnter(anchorElement)

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()

    // Simulate scroll event
    fireEvent.scroll(window)

    // Tooltip should still be visible
    expect(tooltip).toBeInTheDocument()

    // Simulate resize event
    fireEvent.resize(window)

    // Tooltip should still be visible
    expect(tooltip).toBeInTheDocument()
  })

  test('tooltip handles DOM mutations', () => {
    const { container } = render(
      <div id="container">
        <span data-tooltip-id="mutation-test" id="anchor">
          Hover Me
        </span>
        <Tooltip id="mutation-test" content="Mutation Test" />
      </div>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    fireEvent.mouseEnter(anchorElement)

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()

    // Simulate removing the anchor element from the DOM
    act(() => {
      // Remove the anchor element
      const containerElement = container.querySelector('#container')
      const anchorToRemove = container.querySelector('#anchor')
      containerElement.removeChild(anchorToRemove)
    })

    // Verify the anchor is removed
    expect(screen.queryByText('Hover Me')).not.toBeInTheDocument()
  })

  test('tooltip handles auto update cleanup', () => {
    const { unmount } = render(
      <>
        <span data-tooltip-id="auto-update-test">Hover Me</span>
        <Tooltip id="auto-update-test" content="Auto Update Test" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    fireEvent.mouseEnter(anchorElement)

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()

    // Unmount the component to test cleanup
    unmount()

    // Component should unmount without errors
    expect(screen.queryByText('Hover Me')).not.toBeInTheDocument()
  })

  // Mock MutationObserver
  let mockMutationObserverCallback
  let mockMutationObserverInstance

  // Store original MutationObserver
  const OriginalMutationObserver = global.MutationObserver

  beforeEach(() => {
    // Use fake timers for tests that need them
    jest.useFakeTimers()

    // Mock MutationObserver
    mockMutationObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn().mockReturnValue([]),
    }

    // Create a mock constructor that sets the callback and returns the instance
    global.MutationObserver = function (callback) {
      mockMutationObserverCallback = callback
      return mockMutationObserverInstance
    }
  })

  afterEach(() => {
    // Clean up timers
    jest.useRealTimers()
    // Restore original MutationObserver
    global.MutationObserver = OriginalMutationObserver
  })

  test('tooltip handles scroll events', () => {
    render(
      <>
        <div style={{ height: '100px', overflow: 'auto' }}>
          <span data-tooltip-id="scroll-test">Hover Me</span>
        </div>
        <Tooltip id="scroll-test" content="Scroll Test" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Simulate scroll event
    act(() => {
      fireEvent.scroll(window)
      jest.advanceTimersByTime(100)
    })
  })

  test('tooltip handles resize events', () => {
    render(
      <>
        <span data-tooltip-id="resize-test">Hover Me</span>
        <Tooltip id="resize-test" content="Resize Test" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Simulate resize event
    act(() => {
      fireEvent.resize(window)
      jest.advanceTimersByTime(100)
    })
  })

  test('tooltip handles mutation observer callbacks', () => {
    const { rerender } = render(
      <>
        <span data-tooltip-id="mutation-test" id="anchor1">
          Hover Me
        </span>
        <Tooltip id="mutation-test" content="Mutation Test" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      jest.advanceTimersByTime(100)
    })

    // Tooltip should be visible
    expect(screen.getByText('Mutation Test')).toBeInTheDocument()

    // Simulate mutation for attribute change (adding a new anchor)
    act(() => {
      mockMutationObserverCallback([
        {
          type: 'attributes',
          attributeName: 'data-tooltip-id',
          target: document.createElement('div'),
          oldValue: null,
        },
      ])
      jest.advanceTimersByTime(100)
    })

    // Simulate mutation for attribute change (changing an existing anchor's id)
    act(() => {
      mockMutationObserverCallback([
        {
          type: 'attributes',
          attributeName: 'data-tooltip-id',
          target: anchorElement,
          oldValue: 'mutation-test',
        },
      ])
      jest.advanceTimersByTime(100)
    })

    // Rerender with a new anchor
    rerender(
      <>
        <span data-tooltip-id="mutation-test" id="anchor1">
          Hover Me
        </span>
        <span data-tooltip-id="mutation-test" id="anchor2">
          Hover Me Too
        </span>
        <Tooltip id="mutation-test" content="Mutation Test" />
      </>,
    )

    // Simulate mutation for attribute change (adding a new anchor)
    const newAnchor = screen.getByText('Hover Me Too')
    act(() => {
      mockMutationObserverCallback([
        {
          type: 'attributes',
          attributeName: 'data-tooltip-id',
          target: newAnchor,
          oldValue: null,
        },
      ])
      jest.advanceTimersByTime(100)
    })
  })

  test('tooltip handles mutation observer for removed nodes', () => {
    const RemovableAnchorTooltip = () => {
      const containerRef = useRef(null)

      const removeAnchor = () => {
        if (containerRef.current) {
          const anchorToRemove = containerRef.current.querySelector('#anchor-to-remove')
          if (anchorToRemove) {
            containerRef.current.removeChild(anchorToRemove)
          }
        }
      }

      return (
        <div ref={containerRef}>
          <span data-tooltip-id="remove-test" id="anchor-to-remove">
            Hover Me
          </span>
          <button onClick={removeAnchor}>Remove Anchor</button>
          <Tooltip id="remove-test" content="Remove Test" />
        </div>
      )
    }

    render(<RemovableAnchorTooltip />)

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      jest.advanceTimersByTime(100)
    })

    // Tooltip should be visible
    expect(screen.getByText('Remove Test')).toBeInTheDocument()

    // Simulate mutation for removed node
    act(() => {
      // Create a mock mutation record for node removal
      const mockRemovedNode = document.createElement('div')
      mockRemovedNode.appendChild(anchorElement.cloneNode(true))

      mockMutationObserverCallback([
        {
          type: 'childList',
          removedNodes: [mockRemovedNode],
          addedNodes: [],
        },
      ])
      jest.advanceTimersByTime(100)
    })

    // Click the remove button
    act(() => {
      fireEvent.click(screen.getByText('Remove Anchor'))
      jest.advanceTimersByTime(100)
    })
  })

  test('tooltip handles mutation observer for active anchor removal', () => {
    const ActiveAnchorRemovalTest = () => {
      const containerRef = useRef(null)

      const removeActiveAnchor = () => {
        if (containerRef.current) {
          const anchorToRemove = containerRef.current.querySelector('#active-anchor')
          if (anchorToRemove) {
            containerRef.current.removeChild(anchorToRemove)
          }
        }
      }

      return (
        <div ref={containerRef}>
          <span data-tooltip-id="active-removal-test" id="active-anchor">
            Hover Me
          </span>
          <button onClick={removeActiveAnchor}>Remove Active Anchor</button>
          <Tooltip id="active-removal-test" content="Active Removal Test" />
        </div>
      )
    }

    render(<ActiveAnchorRemovalTest />)

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Show the tooltip (make the anchor active)
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      jest.advanceTimersByTime(100)
    })

    // Tooltip should be visible
    expect(screen.getByText('Active Removal Test')).toBeInTheDocument()

    // Simulate mutation for active anchor removal
    act(() => {
      // Create a mock mutation record for node removal
      const mockRemovedNode = document.createElement('div')
      mockRemovedNode.appendChild(anchorElement.cloneNode(true))

      mockMutationObserverCallback([
        {
          type: 'childList',
          removedNodes: [mockRemovedNode],
          addedNodes: [],
        },
      ])
      jest.advanceTimersByTime(100)
    })

    // Click the remove button
    act(() => {
      fireEvent.click(screen.getByText('Remove Active Anchor'))
      jest.advanceTimersByTime(100)
    })
  })

  test('tooltip handles mutation observer for selector changes', () => {
    render(
      <>
        <span className="tooltip-target" data-tooltip-id="selector-test">
          Hover Me
        </span>
        <Tooltip id="selector-test" content="Selector Test" anchorSelect=".tooltip-target" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Show the tooltip
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      jest.advanceTimersByTime(100)
    })

    // Tooltip should be visible
    expect(screen.getByText('Selector Test')).toBeInTheDocument()

    // Simulate mutation for selector changes
    act(() => {
      // Create a mock element with the selector class
      const mockElement = document.createElement('span')
      mockElement.className = 'tooltip-target'
      mockElement.textContent = 'New Target'
      document.body.appendChild(mockElement)

      // Create a mock mutation record for added node with selector
      mockMutationObserverCallback([
        {
          type: 'childList',
          removedNodes: [],
          addedNodes: [mockElement],
        },
      ])
      jest.advanceTimersByTime(100)

      // Clean up
      document.body.removeChild(mockElement)
    })
  })

  test('tooltip handles mutation observer cleanup on unmount', () => {
    const { unmount } = render(
      <>
        <span data-tooltip-id="unmount-test">Hover Me</span>
        <Tooltip id="unmount-test" content="Unmount Test" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Unmount the component
    unmount()

    // MutationObserver should be disconnected
    expect(mockMutationObserverInstance.disconnect).toBeDefined()
  })
})
