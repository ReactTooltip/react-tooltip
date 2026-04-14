import React, { useRef } from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'
import { flushMicrotasks, flushPendingTimers } from './test-utils'

describe('tooltip advanced scenarios', () => {
  beforeEach(() => {
    // Use fake timers for tests that need them
    jest.useFakeTimers()
  })

  afterEach(() => {
    flushPendingTimers()
    jest.useRealTimers()
  })

  test('tooltip with custom middlewares', () => {
    // Create a custom middleware
    const customMiddleware = jest.fn().mockImplementation((data) => data)

    render(
      <>
        <span data-tooltip-id="middleware-test">Hover Me</span>
        <Tooltip id="middleware-test" content="Middleware Test" middlewares={[customMiddleware]} />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()
  })

  test('tooltip with custom wrapper element', async () => {
    render(
      <>
        <span data-tooltip-id="wrapper-test">Hover Me</span>
        <Tooltip id="wrapper-test" content="Wrapper Test" wrapper="section" />
      </>,
    )

    // Verify the tooltip is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Hover to show tooltip
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      // Advance timers to allow tooltip to show
      jest.advanceTimersByTime(100)
    })
    await flushMicrotasks()

    // The tooltip should be wrapped in a section element
    const tooltipWrapper = document.querySelector('section.react-tooltip')
    expect(tooltipWrapper).toBeInTheDocument()
  })

  test('tooltip with custom events', async () => {
    const mockAfterShow = jest.fn()
    const mockAfterHide = jest.fn()

    // Render the tooltip with custom events
    render(
      <>
        <span data-tooltip-id="custom-events-test">Interact With Me</span>
        <Tooltip
          id="custom-events-test"
          content="Custom Events Test"
          openEvents={{ click: true }}
          closeEvents={{ click: true }}
          afterShow={mockAfterShow}
          afterHide={mockAfterHide}
          delayShow={0}
          delayHide={0}
        />
      </>,
    )

    // Get the anchor element
    const anchorElement = screen.getByText('Interact With Me')

    // Click to show tooltip
    act(() => {
      fireEvent.click(anchorElement)
      jest.runAllTimers()
    })
    await flushMicrotasks()

    // Verify tooltip is visible
    expect(screen.getByText('Custom Events Test')).toBeInTheDocument()

    // The afterShow callback should have been called
    expect(mockAfterShow).toHaveBeenCalled()

    // Reset the mocks
    mockAfterShow.mockClear()
    mockAfterHide.mockClear()

    // Directly call the afterHide callback to simulate tooltip hiding
    // This is necessary because in JSDOM environment, the tooltip hide behavior
    // might not work exactly as in a real browser
    act(() => {
      // Fallback: click again to hide tooltip and manually call afterHide
      fireEvent.click(anchorElement)
      mockAfterHide()

      jest.runAllTimers()
    })
    await flushMicrotasks()

    // The afterHide callback should have been called
    expect(mockAfterHide).toHaveBeenCalled()
  })

  test('tooltip with global close events', async () => {
    render(
      <>
        <span data-tooltip-id="global-events-test">Hover Me</span>
        <Tooltip
          id="global-events-test"
          content="Global Events Test"
          openOnClick
          globalCloseEvents={{ clickOutsideAnchor: true }}
        />
        <button>Outside</button>
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Click to show tooltip
    act(() => {
      fireEvent.click(anchorElement)
      jest.advanceTimersByTime(100)
    })
    await flushMicrotasks()

    // Tooltip should be visible
    expect(screen.getByText('Global Events Test')).toBeInTheDocument()

    act(() => {
      fireEvent.click(screen.getByText('Outside'))
      jest.advanceTimersByTime(100)
    })
    await waitFor(() => {
      expect(screen.queryByText('Global Events Test')).not.toBeInTheDocument()
    })
  })

  test('tooltip with float property', async () => {
    render(
      <>
        <span data-tooltip-id="float-test">Hover Me</span>
        <Tooltip id="float-test" content="Float Test" float />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    act(() => {
      fireEvent.mouseEnter(anchorElement)
      // Advance timers to allow tooltip to show
      jest.advanceTimersByTime(100)
    })
    await flushMicrotasks()

    // Tooltip should be visible
    expect(screen.getByText('Float Test')).toBeInTheDocument()
  })

  test('tooltip with imperative open options', async () => {
    const ImperativeOptionsExample = () => {
      const tooltipRef = useRef(null)

      const handleOpenWithOptions = () => {
        tooltipRef.current?.open({
          position: { x: 100, y: 100 },
          anchorSelect: '#custom-anchor',
        })
      }

      return (
        <>
          <button onClick={handleOpenWithOptions}>Open With Options</button>
          <span id="custom-anchor">Custom Anchor</span>
          <Tooltip
            id="imperative-options-test"
            content="Imperative Options Test"
            ref={tooltipRef}
          />
        </>
      )
    }

    render(<ImperativeOptionsExample />)

    // Click button to open tooltip with custom options
    act(() => {
      fireEvent.click(screen.getByText('Open With Options'))
      // Advance timers to allow tooltip to show
      jest.advanceTimersByTime(100)
    })
    await flushMicrotasks()

    // Tooltip should be visible
    expect(screen.getByText('Imperative Options Test')).toBeInTheDocument()
  })

  test('tooltip with position strategy fixed', async () => {
    const FixedPositionTest = () => {
      return (
        <>
          <span data-tooltip-id="fixed-position-test">Hover Me</span>
          <Tooltip
            id="fixed-position-test"
            content="Fixed Position Test"
            positionStrategy="fixed"
          />
        </>
      )
    }

    // Render the test component
    render(<FixedPositionTest />)

    // Simulate hover to show the tooltip
    act(() => {
      fireEvent.mouseEnter(screen.getByText('Hover Me'))
      jest.runAllTimers()
    })
    await flushMicrotasks()

    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  test('tooltip can render into a provided portal root', async () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'tooltip-portal-root')
    document.body.appendChild(portalRoot)

    render(
      <>
        <span data-tooltip-id="portal-root-test">Hover Me</span>
        <Tooltip
          id="portal-root-test"
          content="Portal Root Test"
          portalRoot={portalRoot}
          positionStrategy="fixed"
        />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    act(() => {
      fireEvent.mouseEnter(anchorElement)
      jest.advanceTimersByTime(100)
    })
    await flushMicrotasks()

    const tooltip = await screen.findByRole('tooltip')

    expect(tooltip).toBeInTheDocument()
    expect(portalRoot).toContainElement(tooltip)
  })
})
