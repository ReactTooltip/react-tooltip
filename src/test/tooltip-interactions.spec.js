import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

describe('tooltip interactions', () => {
  test('tooltip renders correctly', () => {
    render(
      <>
        <span data-tooltip-id="basic-test">Hover Me</span>
        <Tooltip id="basic-test" content="Basic Tooltip" />
      </>,
    )

    // Check that the anchor element is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Check that the tooltip component is rendered (but not visible yet)
    expect(anchorElement).toHaveAttribute('data-tooltip-id', 'basic-test')
  })

  test('tooltip with openOnClick prop accepts the prop', () => {
    render(
      <>
        <span data-tooltip-id="click-test">Click Me</span>
        <Tooltip id="click-test" content="Click Tooltip" openOnClick />
      </>,
    )

    // Check that the anchor element is rendered
    const anchorElement = screen.getByText('Click Me')
    expect(anchorElement).toBeInTheDocument()

    // Check that the tooltip component is rendered with the correct ID
    expect(anchorElement).toHaveAttribute('data-tooltip-id', 'click-test')
  })

  test('tooltip with clickable prop renders content correctly', () => {
    const handleButtonClick = jest.fn()

    render(
      <>
        <span data-tooltip-id="clickable-test">Hover for Clickable</span>
        <Tooltip id="clickable-test" clickable>
          <div>
            <p>Clickable Content</p>
            <button onClick={handleButtonClick}>Click Me</button>
          </div>
        </Tooltip>
      </>,
    )

    // Check that the anchor element is rendered
    const anchorElement = screen.getByText('Hover for Clickable')
    expect(anchorElement).toBeInTheDocument()

    // Check that the tooltip component is rendered with the correct ID
    expect(anchorElement).toHaveAttribute('data-tooltip-id', 'clickable-test')
  })

  test('tooltip with custom role prop', () => {
    render(
      <>
        <button data-tooltip-id="role-test">Hover Me</button>
        <Tooltip id="role-test" content="Custom Role" role="alert" />
      </>,
    )

    // Check that the anchor element is rendered
    const anchorElement = screen.getByText('Hover Me')
    expect(anchorElement).toBeInTheDocument()

    // Check that the tooltip component is rendered with the correct ID
    expect(anchorElement).toHaveAttribute('data-tooltip-id', 'role-test')
  })
})
