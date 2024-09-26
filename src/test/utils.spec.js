import '@testing-library/jest-dom'
import {
  debounce,
  deepEqual,
  computeTooltipPosition,
  cssTimeToMs,
  clearTimeoutRef,
  getScrollParent,
} from 'utils'
import { injectStyle, injected } from 'utils/handle-style.ts'
import { isScrollable } from 'utils/get-scroll-parent'

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

describe('clearTimeoutRef', () => {
  jest.useFakeTimers()

  const func = jest.fn()

  test('clears timeout ref', () => {
    const timeoutRef = { current: setTimeout(func, 1000) }
    clearTimeoutRef(timeoutRef)

    jest.runAllTimers()

    expect(func).not.toHaveBeenCalled()
    expect(timeoutRef.current).toBe(null)
  })
})

describe('getScrollParent', () => {
  let div
  let scrollParent

  beforeEach(() => {
    // Basic DOM setup simulating a container with scroll
    div = document.createElement('div')
    scrollParent = document.createElement('div')

    document.body.appendChild(scrollParent)
    scrollParent.appendChild(div)

    // Reset styles before each test
    scrollParent.style.overflow = ''
    scrollParent.style.overflowY = ''
    scrollParent.style.overflowX = ''
  })

  afterEach(() => {
    // Clear the DOM after each test
    document.body.innerHTML = ''
  })

  test('returns null when no element is provided', () => {
    expect(getScrollParent(null)).toBeNull()
  })

  test('returns document.scrollingElement when no scrollable parent is found', () => {
    expect(getScrollParent(div)).toBe(document.scrollingElement || document.documentElement)
  })

  test('returns the parent when it has overflow set to auto', () => {
    scrollParent.style.overflow = 'auto'
    expect(getScrollParent(div)).toBe(scrollParent)
  })

  test('returns the parent when it has overflow-y set to scroll', () => {
    scrollParent.style.overflowY = 'scroll'
    expect(getScrollParent(div)).toBe(scrollParent)
  })

  test('returns the parent when it has overflow-x set to auto', () => {
    scrollParent.style.overflowX = 'auto'
    expect(getScrollParent(div)).toBe(scrollParent)
  })

  test('returns the parent when multiple ancestors exist with overflow', () => {
    const grandParent = document.createElement('div')
    document.body.appendChild(grandParent)
    grandParent.appendChild(scrollParent)

    grandParent.style.overflow = 'auto'
    scrollParent.style.overflow = 'scroll'

    expect(getScrollParent(div)).toBe(scrollParent)
  })

  test('returns document.scrollingElement when no scroll parent is found', () => {
    scrollParent.style.overflow = 'visible' // overflow that doesn't allow scrolling
    expect(getScrollParent(div)).toBe(document.scrollingElement || document.documentElement)
  })
})

describe('isScrollable', () => {
  test('returns false for non-HTMLElement and non-SVGElement nodes', () => {
    const textNode = document.createTextNode('This is a text node')
    const commentNode = document.createComment('This is a comment node')
    const fragment = document.createDocumentFragment()

    expect(isScrollable(textNode)).toBe(false)
    expect(isScrollable(commentNode)).toBe(false)
    expect(isScrollable(fragment)).toBe(false)
  })

  test('returns false for HTMLElement with no scrollable styles', () => {
    const div = document.createElement('div')
    div.style.overflow = 'visible' // No scrolling allowed
    expect(isScrollable(div)).toBe(false)
  })

  test('returns true for HTMLElement with scrollable styles', () => {
    const div = document.createElement('div')
    div.style.overflow = 'auto' // Scrollable
    expect(isScrollable(div)).toBe(true)
  })

  test('returns true for SVGElement with scrollable styles', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.overflow = 'scroll' // Scrollable
    expect(isScrollable(svg)).toBe(true)
  })
})

describe('injectStyle', () => {
  const cssBase = 'body { background-color: red; }'
  const cssCore = 'body { background-color: blue; }'

  beforeEach(() => {
    document.head.innerHTML = '' // Reset the DOM
    jest.resetModules() // Ensure module reset between tests
  })

  test('should not inject if no CSS is provided', () => {
    injectStyle({ css: '' })
    const styleElement = document.getElementById('react-tooltip-base-styles')
    expect(styleElement).not.toBeInTheDocument()
  })

  test('should not inject base styles if already injected', () => {
    const sharedState = { core: false, base: false }

    injectStyle({ css: cssBase, state: sharedState })
    injectStyle({ css: cssBase, state: sharedState }) // Attempt to inject again

    const styleElements = document.querySelectorAll('#react-tooltip-base-styles')
    expect(styleElements.length).toBe(1) // Only one instance
  })

  test('should not inject core styles if already injected', () => {
    const sharedState = { core: false, base: false }

    injectStyle({ css: cssCore, type: 'core', state: sharedState })
    injectStyle({ css: cssCore, type: 'core', stage: sharedState })

    const styleElements = document.querySelectorAll('#react-tooltip-core-styles')
    expect(styleElements.length).toBe(1) // Only one instance
  })

  test('should not inject core styles if REACT_TOOLTIP_DISABLE_CORE_STYLES is set', () => {
    process.env.REACT_TOOLTIP_DISABLE_CORE_STYLES = 'true'
    injectStyle({ css: cssCore, type: 'core' })

    const styleElement = document.getElementById('react-tooltip-core-styles')
    expect(styleElement).not.toBeInTheDocument()

    delete process.env.REACT_TOOLTIP_DISABLE_CORE_STYLES // Clean up
  })

  test('should not inject base styles if REACT_TOOLTIP_DISABLE_BASE_STYLES is set', () => {
    process.env.REACT_TOOLTIP_DISABLE_BASE_STYLES = 'true'
    injectStyle({ css: cssBase, state: { core: false, base: false } })

    const styleElement = document.getElementById('react-tooltip-base-styles')
    expect(styleElement).not.toBeInTheDocument()

    delete process.env.REACT_TOOLTIP_DISABLE_BASE_STYLES // Clean up
  })

  test('should inject base styles into the DOM', () => {
    injectStyle({ css: cssBase, state: { core: false, base: false } })

    const styleElement = document.getElementById('react-tooltip-base-styles')
    expect(styleElement).toBeInTheDocument()
    expect(styleElement.textContent).toBe(cssBase)
  })

  test('should inject core styles into the DOM', () => {
    injectStyle({ css: cssCore, type: 'core', state: { core: false, base: false } })

    const styleElement = document.getElementById('react-tooltip-core-styles')
    expect(styleElement).toBeInTheDocument()
    expect(styleElement.textContent).toBe(cssCore)
  })

  test('should inject style at the top of the head when insertAt is "top"', () => {
    injectStyle({ css: cssBase, ref: { insertAt: 'top' }, state: { core: false, base: false } })

    const firstStyleElement = document.head.firstChild
    expect(firstStyleElement.textContent).toBe(cssBase)
  })

  test('should inject style at the bottom of the head when insertAt is not "top"', () => {
    const appendChildSpy = jest.spyOn(document.head, 'appendChild')

    // No need to provide insertAt: 'bottom', just omit it
    injectStyle({ css: cssBase, state: { core: false, base: false } })

    expect(appendChildSpy).toHaveBeenCalledTimes(1) // Append should be called
    const lastStyleElement = document.head.lastChild
    expect(lastStyleElement.textContent).toBe(cssBase) // Check the inserted style content

    appendChildSpy.mockRestore() // Clean up the spy
  })

  test('should handle legacy IE styleSheet property', () => {
    // Mock the style element with styleSheet property (for older IE)
    const styleMock = document.createElement('style')
    styleMock.styleSheet = { cssText: '' } // Add the legacy styleSheet property

    // Spy on document.createElement to return our mock when 'style' is created
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'style') {
        return styleMock
      }
      return document.createElement(tag) // Return the original for other elements
    })

    // Inject the style
    injectStyle({ css: 'body { background-color: red; }', state: { core: false, base: false } })

    // Check that the styleSheet property was updated correctly
    expect(styleMock.styleSheet.cssText).toBe('body { background-color: red; }')

    // Restore the original document.createElement implementation
    createElementSpy.mockRestore()
  })

  test('should update state[type] after injection', () => {
    injectStyle({ css: 'body { color: black; }' })
    expect(injected.base).toBe(true)

    injectStyle({ css: 'body { color: blue; }', type: 'core' })
    expect(injected.core).toBe(true)
  })

  test('should inject styles before the first child of head element', () => {
    const fisrtStyleElement = document.createElement('style')
    fisrtStyleElement.id = 'old-first-child'
    document.head.appendChild(fisrtStyleElement)

    injectStyle({
      css: cssBase,
      ref: { insertAt: 'top' },
      state: { core: false, base: false },
    })

    const styleElement = document.getElementById('react-tooltip-base-styles')

    expect(fisrtStyleElement).toBeInTheDocument()
    expect(document.head.firstChild).toBe(styleElement)
  })

  test('should not fail if process.env is undefined', () => {
    const originalEnv = process.env
    delete process.env

    expect(() => {
      injectStyle({ css: cssCore, type: 'core' })
    }).not.toThrow()

    process.env = originalEnv
  })

  test('should use document.getElementsByTagName when document.head is undefined', () => {
    // Backup the original document.head
    const originalHead = document.head
    const mockHeadElement = document.createElement('head')

    // Remove document.head
    Object.defineProperty(document, 'head', {
      get: () => undefined,
      configurable: true,
    })

    // Spy on getElementsByTagName and return a mock head element
    const getElementsByTagNameSpy = jest
      .spyOn(document, 'getElementsByTagName')
      .mockReturnValue([mockHeadElement])

    // Execute the injectStyle function
    injectStyle({ css: 'body { color: black; }', state: { core: false, base: false } })

    // Ensure getElementsByTagName was called with 'head'
    expect(getElementsByTagNameSpy).toHaveBeenCalledWith('head')

    // Ensure the style element was correctly appended to the mock head element
    const styleElement = mockHeadElement.querySelector('style')
    expect(styleElement).not.toBeNull()
    expect(styleElement.textContent).toBe('body { color: black; }')

    // Restore the original document.head
    Object.defineProperty(document, 'head', {
      get: () => originalHead,
    })

    getElementsByTagNameSpy.mockRestore()
  })
})
