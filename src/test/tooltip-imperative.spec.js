import React, { useRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// Component that uses imperative API
const ImperativeTooltipExample = ({ onAfterShow, onAfterHide }) => {
  const tooltipRef = useRef(null)

  const handleOpen = () => {
    tooltipRef.current?.open()
  }

  const handleClose = () => {
    tooltipRef.current?.close()
  }

  return (
    <>
      <button onClick={handleOpen}>Open Tooltip</button>
      <button onClick={handleClose}>Close Tooltip</button>
      <span data-tooltip-id="imperative-tooltip">Target Element</span>
      <Tooltip
        id="imperative-tooltip"
        content="Imperative Tooltip"
        ref={tooltipRef}
        afterShow={onAfterShow}
        afterHide={onAfterHide}
      />
    </>
  )
}

describe('tooltip imperative API', () => {
  test('tooltip can be opened and closed imperatively', async () => {
    render(<ImperativeTooltipExample />)

    // Initially tooltip should not be visible
    expect(screen.queryByText('Imperative Tooltip')).not.toBeInTheDocument()

    // Click button to open tooltip
    await userEvent.click(screen.getByText('Open Tooltip'))

    // Tooltip should be visible
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Imperative Tooltip')

    // Click button to close tooltip
    await userEvent.click(screen.getByText('Close Tooltip'))

    // Tooltip should be hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  test('tooltip fires afterShow and afterHide callbacks', async () => {
    const afterShowMock = jest.fn()
    const afterHideMock = jest.fn()

    render(<ImperativeTooltipExample onAfterShow={afterShowMock} onAfterHide={afterHideMock} />)

    // Open tooltip
    await userEvent.click(screen.getByText('Open Tooltip'))

    // Wait for tooltip to appear
    await screen.findByRole('tooltip')

    // afterShow should be called
    await waitFor(() => {
      expect(afterShowMock).toHaveBeenCalledTimes(1)
    })

    // Close tooltip
    await userEvent.click(screen.getByText('Close Tooltip'))

    // Wait for tooltip to disappear
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    // afterHide should be called
    expect(afterHideMock).toHaveBeenCalledTimes(1)
  })

  test('tooltip with imperativeModeOnly does not respond to hover', async () => {
    render(
      <>
        <span data-tooltip-id="imperative-only">Hover Me</span>
        <Tooltip id="imperative-only" content="Imperative Only" imperativeModeOnly />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover over anchor
    await userEvent.hover(anchorElement)

    // Tooltip should not appear because imperativeModeOnly is true
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  test('tooltip with isOpen controlled prop', async () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = React.useState(false)

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <button onClick={() => setIsOpen(false)}>Close</button>
          <span data-tooltip-id="controlled-tooltip">Target</span>
          <Tooltip
            id="controlled-tooltip"
            content="Controlled Tooltip"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </>
      )
    }

    render(<TestComponent />)

    // Initially tooltip should not be visible
    expect(screen.queryByText('Controlled Tooltip')).not.toBeInTheDocument()

    // Click button to open tooltip
    await userEvent.click(screen.getByText('Open'))

    // Tooltip should be visible
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()

    // Click button to close tooltip
    await userEvent.click(screen.getByText('Close'))

    // Tooltip should be hidden
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })
})
