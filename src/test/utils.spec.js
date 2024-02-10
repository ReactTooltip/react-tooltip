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

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {}, place: 'top' })
  })

  test('empty tooltip reference element', async () => {
    const element = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: null,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {}, place: 'top' })
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
      place: 'bottom',
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

    expect(value).toMatchSnapshot()
  })
})

describe('debounce', () => {
  jest.useFakeTimers()

  const func = jest.fn()

  test('execute just once', () => {
    const debouncedFunc = debounce(func, 1000)
    for (let i = 0; i < 100; i += 1) {
      debouncedFunc()
    }

    expect(func).not.toHaveBeenCalled()

    jest.runAllTimers()

    expect(func).toBeCalledTimes(1)
  })

  test('execute immediately just once', () => {
    const debouncedFunc = debounce(func, 1000, true)

    debouncedFunc()
    expect(func).toBeCalledTimes(1)

    for (let i = 0; i < 100; i += 1) {
      debouncedFunc()
    }

    jest.runAllTimers()

    expect(func).toHaveBeenCalledTimes(1)
  })

  test('does not execute after cancel', () => {
    const debouncedFunc = debounce(func, 1000)

    debouncedFunc()

    expect(func).not.toHaveBeenCalled()

    debouncedFunc.cancel()

    jest.runAllTimers()

    expect(func).not.toHaveBeenCalled()
  })
})
})
