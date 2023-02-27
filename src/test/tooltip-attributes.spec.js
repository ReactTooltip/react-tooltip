import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// eslint-disable-next-line react/prop-types
const TooltipAttrs = ({ id, ...anchorParams }) => (
  <>
    <span id={id} {...anchorParams}>
      Lorem Ipsum
    </span>
    <Tooltip anchorId={id} />
  </>
)

describe('tooltip attributes', () => {
  test('tooltip without element reference', async () => {
    const { container } = render(<TooltipAttrs data-tooltip-content="Hello World!" />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    await waitFor(() => {
      expect(screen.queryByText('Hello World!')).not.toBeInTheDocument()
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    expect(container).toMatchSnapshot()
  })

  test('basic tooltip', async () => {
    const { container } = render(
      <TooltipAttrs id="basic-example-attr" data-tooltip-content="Hello World!" />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(anchorElement).toHaveAttribute('data-tooltip-content')
    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with place', async () => {
    const { container } = render(
      <TooltipAttrs
        id="example-place-attr"
        data-tooltip-content="Hello World!"
        data-tooltip-place="right"
      />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(anchorElement).toHaveAttribute('data-tooltip-place')
    expect(anchorElement).toHaveAttribute('data-tooltip-content')
    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
