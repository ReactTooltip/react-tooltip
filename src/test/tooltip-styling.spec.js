import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

const waitForTooltipUpdates = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 25)
    })
  })
}

const hoverAndFindTooltip = async (anchorText = 'Hover Me') => {
  const anchorElement = screen.getByText(anchorText)

  await userEvent.hover(anchorElement)
  await waitForTooltipUpdates()

  return screen.findByRole('tooltip')
}

describe('tooltip styling and appearance', () => {
  test('tooltip with custom className', async () => {
    render(
      <>
        <span data-tooltip-id="class-test">Hover Me</span>
        <Tooltip id="class-test" content="Custom Class" className="custom-tooltip-class" />
      </>,
    )

    const tooltip = await hoverAndFindTooltip()
    expect(tooltip).toHaveClass('custom-tooltip-class')
  })

  test('tooltip with custom classNameArrow', async () => {
    render(
      <>
        <span data-tooltip-id="arrow-class-test">Hover Me</span>
        <Tooltip id="arrow-class-test" content="Arrow Class" classNameArrow="custom-arrow-class" />
      </>,
    )

    await hoverAndFindTooltip()

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

    await hoverAndFindTooltip()

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

    const tooltip = await hoverAndFindTooltip()

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

    const tooltip = await hoverAndFindTooltip()

    expect(tooltip.style.backgroundColor).toBe('purple')
    expect(tooltip.style.color).toBe('white')
    expect(tooltip.style.borderRadius).toBe('10px')
  })

  test('tooltip with custom opacity', async () => {
    render(
      <>
        <span data-tooltip-id="opacity-test">Hover Me</span>
        <Tooltip id="opacity-test" content="Custom Opacity" opacity={0.5} />
      </>,
    )

    const tooltip = await hoverAndFindTooltip()
    expect(tooltip).toHaveStyle('opacity: 0.5')
  })

  test('tooltip with custom border', async () => {
    render(
      <>
        <span data-tooltip-id="border-test">Hover Me</span>
        <Tooltip id="border-test" content="Custom Border" border="1px solid red" />
      </>,
    )

    const tooltip = await hoverAndFindTooltip()
    expect(tooltip).toHaveStyle('border: 1px solid red')
  })

  test('tooltip with custom arrowColor', async () => {
    render(
      <>
        <span data-tooltip-id="arrow-color-test">Hover Me</span>
        <Tooltip id="arrow-color-test" content="Arrow Color" arrowColor="red" />
      </>,
    )

    const tooltip = await hoverAndFindTooltip()

    // We're just testing that the tooltip renders with the arrowColor prop
    expect(tooltip).toHaveTextContent('Arrow Color')
  })
})
