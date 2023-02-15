import debounce from 'utils/debounce'
import { computeTooltipPosition } from 'utils/compute-positions'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

describe('compute positions', () => {
  test('empty reference elements', async () => {
    const value = await computeTooltipPosition({
      elementReference: null,
      tooltipReference: null,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {} })
  })

  test('empty tooltip reference element', async () => {
    const element = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: null,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {} })
  })

  test('empty tooltip arrow reference element', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({
      tooltipArrowStyles: {},
      tooltipStyles: {
        left: '5px',
        top: '10px',
      },
    })
  })

  test('all reference elements', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const elementTooltipArrow = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: elementTooltipArrow,
    })

    expect(value).toEqual({
      tooltipArrowStyles: {
        bottom: '-4px',
        left: '5px',
        right: '',
        top: '',
      },
      tooltipStyles: {
        left: '5px',
        top: '-10px',
      },
    })
  })
})

describe('debounce', () => {
  jest.useFakeTimers()

  let func
  let debouncedFunc

  beforeEach((timeout = 1000) => {
    func = jest.fn()
    debouncedFunc = debounce(func, timeout)
  })

  test('execute just once', () => {
    for (let i = 0; i < 100; i += 1) {
      debouncedFunc()
    }

    // Fast-forward time
    jest.runAllTimers()

    expect(func).toBeCalledTimes(1)
  })
})
