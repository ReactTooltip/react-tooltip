import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// eslint-disable-next-line react/prop-types
const TooltipProps = ({ id, ...tooltipParams }) => (
  <>
    <span id={id}>Lorem Ipsum</span>
    <Tooltip anchorId={id} {...tooltipParams} />
  </>
)
// eslint-disable-next-line react/prop-types
const TooltipAttrs = ({ id, ...anchorParams }) => (
  <>
    <span id={id} {...anchorParams}>
      Lorem Ipsum
    </span>
    <Tooltip anchorId={id} />
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

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with place', async () => {
    const { container } = render(
      <TooltipProps id="example-place" content="Hello World!" place="right" />,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('tooltip with html', async () => {
    const { container } = render(<TooltipProps id="example-html" html="<div>Hello World!<div>" />)
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('clickable tooltip', async () => {
    const id = 'example-clickable'

    const mockCallBack = jest.fn()
    const { container } = render(
      <>
        <span id={id}>Lorem Ipsum</span>
        <Tooltip anchorId={id} clickable>
          <button onClick={mockCallBack}>button</button>
        </Tooltip>
      </>,
    )
    const anchorElement = screen.getByText('Lorem Ipsum')

    await userEvent.hover(anchorElement)

    let tooltip = null
    let button = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
      button = screen.getByRole('button')
    })

    await userEvent.click(button)

    expect(tooltip).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(mockCallBack).toHaveBeenCalled()
    expect(container).toMatchSnapshot()
  })
})

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
