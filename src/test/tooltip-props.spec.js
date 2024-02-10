import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// eslint-disable-next-line react/prop-types
const TooltipProps = ({ id, ...tooltipParams }) => (
  <>
    <span data-tooltip-id={id}>Lorem Ipsum</span>
    <Tooltip id={id} {...tooltipParams} />
  </>
)

describe('tooltip props', () => {
  test('tooltip without element reference', async () => {
    const { container } = render(<TooltipProps content="Hello World!" />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    await waitFor(() => {
      expect(screen.queryByText('Hello World!')).not.toBeInTheDocument()
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    expect(container).toMatchSnapshot()
  })

  test('basic tooltip', async () => {
    const { container } = render(<TooltipProps id="basic-example" content="Hello World!" />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with place', async () => {
    const { container } = render(
      <TooltipProps id="example-place" content="Hello World!" place="right" />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with html', async () => {
    const { container } = render(<TooltipProps id="example-html" html="<div>Hello World!<div>" />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('clickable tooltip', async () => {
    const id = 'example-clickable'

    const mockCallBack = jest.fn()
    const { container } = render(
      <>
        <span data-tooltip-id={id}>Lorem Ipsum</span>
        <Tooltip id={id} clickable>
          <button onClick={mockCallBack}>button</button>
        </Tooltip>
      </>,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    const button = await screen.findByRole('button')

    await userEvent.click(button)

    expect(tooltip).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(mockCallBack).toHaveBeenCalled()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with delay show', async () => {
    const { container } = render(
      <TooltipProps id="example-delay-show" content="Hello World!" delayShow={300} />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toHaveClass('react-tooltip__show')
    })

    expect(container).toMatchSnapshot()
  })

  test('tooltip with delay hide', async () => {
    const { container } = render(
      <TooltipProps id="example-delay-hide" content="Hello World!" delayHide={300} />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()

    await userEvent.unhover(anchorElement)

    await waitFor(
      () => {
        expect(tooltip).toBeInTheDocument()
      },
      {
        timeout: 200,
      },
    )

    await waitFor(
      () => {
        expect(tooltip).not.toBeInTheDocument()
      },
      {
        timeout: 500,
      },
    )

    expect(container).toMatchSnapshot()
  })

  test('tooltip with custom position', async () => {
    const { container } = render(
      <TooltipProps id="example-place" content="Hello World!" position={{ x: 0, y: 0 }} />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with float', async () => {
    const { container } = render(<TooltipProps id="example-float" content="Hello World!" float />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveAttribute('style')

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
