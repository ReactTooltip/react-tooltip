import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TooltipController as Tooltip } from '../components/TooltipController'
import { TooltipProvider, TooltipWrapper } from '../components/TooltipProvider'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

describe('tooltip props', () => {
  test('basic tooltip component', async () => {
    const { container } = render(
      <TooltipProvider>
        <TooltipWrapper place="bottom" content="Shared Global Tooltip">
          <button>Minimal 1</button>
        </TooltipWrapper>
        <Tooltip>
          <button>button</button>
        </Tooltip>
      </TooltipProvider>,
    )
    const anchorElement = screen.getByText('Minimal 1')

    await userEvent.hover(anchorElement)

    let tooltip = null

    await waitFor(() => {
      tooltip = screen.getByRole('tooltip')
    })

    expect(tooltip).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
