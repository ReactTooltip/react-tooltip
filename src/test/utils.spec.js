import { debounce, deepEqual, computeTooltipPosition, cssTimeToMs } from 'utils'

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

  test('all reference elements with border', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const elementTooltipArrow = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: elementTooltipArrow,
      border: '1px solid red',
    })

    expect(value).toMatchSnapshot()
  })

  test('all reference elements with non-px border', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const elementTooltipArrow = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: elementTooltipArrow,
      border: 'medium solid red',
    })

    expect(value).toMatchSnapshot()
  })
})

describe('css time to ms', () => {
  test('converts time correctly', () => {
    expect(cssTimeToMs('1s')).toBe(1000)
    expect(cssTimeToMs('1ms')).toBe(1)
    expect(cssTimeToMs('1.5s')).toBe(1500)
    expect(cssTimeToMs('1.5ms')).toBe(1.5)
  })

  test('returns 0 if no time is provided', () => {
    expect(cssTimeToMs('')).toBe(0)
  })

  test('returns 0 if unsupported unit', () => {
    expect(cssTimeToMs('1h')).toBe(0)
  })

  test('returns 0 if no unit', () => {
    expect(cssTimeToMs('1000')).toBe(0)
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

describe('deepEqual', () => {
  test('returns true for equal primitives', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual('a', 'a')).toBe(true)
    expect(deepEqual(true, true)).toBe(true)
  })

  test('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual('a', 'b')).toBe(false)
    expect(deepEqual(true, false)).toBe(false)
  })

  test('returns true for equal objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  test('returns false for different objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns false for object with different amount of keys', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1 }

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns true for equal nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { a: 1, b: { c: 2, d: 3 } }

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  test('returns false for different nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { a: 1, b: { c: 2, d: 4 } }

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns true for equal arrays', () => {
    const obj1 = [1, 2, 3]
    const obj2 = [1, 2, 3]

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  test('returns false for different arrays', () => {
    const obj1 = [1, 2, 3]
    const obj2 = [1, 2, 4]

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns false for different length arrays', () => {
    const obj1 = [1, 2, 3]
    const obj2 = [1, 2]

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns false for array with non-array', () => {
    const obj1 = [1, 2, 3]
    const obj2 = 1

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns true for equal nested arrays', () => {
    const obj1 = [1, [2, 3]]
    const obj2 = [1, [2, 3]]

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  test('returns false for different nested arrays', () => {
    const obj1 = [1, [2, 3]]
    const obj2 = [1, [2, 4]]

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  test('returns true for equal mixed objects and arrays', () => {
    const obj1 = { a: 1, b: [2, 3] }
    const obj2 = { a: 1, b: [2, 3] }

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  test('returns false for different mixed objects and arrays', () => {
    const obj1 = { a: 1, b: [2, 3] }
    const obj2 = { a: 1, b: [2, 4] }

    expect(deepEqual(obj1, obj2)).toBe(false)
  })
})
