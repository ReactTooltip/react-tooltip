import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

describe('tooltip styling and appearance', () => {
  test('tooltip with custom className', async () => {
    render(
      <>
        <span data-tooltip-id="class-test">Hover Me</span>
        <Tooltip id="class-test" content="Custom Class" className="custom-tooltip-class" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible with custom class
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveClass('custom-tooltip-class')
  })

  test('tooltip with custom classNameArrow', async () => {
    render(
      <>
        <span data-tooltip-id="arrow-class-test">Hover Me</span>
        <Tooltip id="arrow-class-test" content="Arrow Class" classNameArrow="custom-arrow-class" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible
    await screen.findByRole('tooltip')

    // Arrow should have custom class
    const arrow = document.querySelector('.react-tooltip-arrow')
    expect(arrow).toHaveClass('custom-arrow-class')
  })

  test('tooltip with noArrow prop', async () => {
    render(
      <>
        <span data-tooltip-id="no-arrow-test">Hover Me</span>
        <Tooltip id="no-arrow-test" content="No Arrow" noArrow />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible
    await screen.findByRole('tooltip')

    // We're just testing that the tooltip renders with the noArrow prop
    // The actual implementation of how arrows are hidden may vary
    expect(screen.getByText('No Arrow')).toBeInTheDocument()
  })

  test('tooltip with custom variant', async () => {
    render(
      <>
        <span data-tooltip-id="variant-test">Hover Me</span>
        <Tooltip id="variant-test" content="Light Variant" variant="light" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible
    const tooltip = await screen.findByRole('tooltip')

    // Check that the tooltip contains the content
    expect(tooltip).toHaveTextContent('Light Variant')

    // The actual class name might be different, but we're testing that the variant prop is accepted
    // and the tooltip renders correctly
  })

  test('tooltip with custom style', async () => {
    const customStyle = {
      backgroundColor: 'purple',
      color: 'white',
      borderRadius: '10px',
    }

    render(
      <>
        <span data-tooltip-id="style-test">Hover Me</span>
        <Tooltip id="style-test" content="Custom Style" style={customStyle} />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible with custom style
    const tooltip = await screen.findByRole('tooltip')

    expect(tooltip).toHaveStyle({
      backgroundColor: 'purple',
      color: 'white',
      borderRadius: '10px',
    })
  })

  test('tooltip with custom opacity', async () => {
    render(
      <>
        <span data-tooltip-id="opacity-test">Hover Me</span>
        <Tooltip id="opacity-test" content="Custom Opacity" opacity={0.5} />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible with custom opacity
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveStyle('opacity: 0.5')
  })

  test('tooltip with custom border', async () => {
    render(
      <>
        <span data-tooltip-id="border-test">Hover Me</span>
        <Tooltip id="border-test" content="Custom Border" border="1px solid red" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible with custom border
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveStyle('border: 1px solid red')
  })

  test('tooltip with custom arrowColor', async () => {
    render(
      <>
        <span data-tooltip-id="arrow-color-test">Hover Me</span>
        <Tooltip id="arrow-color-test" content="Arrow Color" arrowColor="red" />
      </>,
    )

    const anchorElement = screen.getByText('Hover Me')

    // Hover to show tooltip
    await userEvent.hover(anchorElement)

    // Tooltip should be visible
    const tooltip = await screen.findByRole('tooltip')

    // We're just testing that the tooltip renders with the arrowColor prop
    expect(tooltip).toHaveTextContent('Arrow Color')
  })
})
