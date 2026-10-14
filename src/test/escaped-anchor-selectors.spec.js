import { subscribeAnchorSelector, resetAnchorRegistry } from '../components/Tooltip/anchor-registry'
import { installMockMutationObserver } from './mutation-observer-test-utils'
import parseDataTooltipIdSelector from '../utils/parse-data-tooltip-id-selector'
import { act } from '@testing-library/react'

describe('escaped anchor selectors', () => {
  let controller
  beforeEach(() => {
    resetAnchorRegistry()
    document.body.innerHTML = ''
    controller = installMockMutationObserver()
  })
  afterEach(() => {
    resetAnchorRegistry()
    controller.restore()
    document.body.innerHTML = ''
  })

  test('uses native selector matching for hexadecimal and backslash escapes', () => {
    expect(parseDataTooltipIdSelector("[data-tooltip-id='\\61 nchor']")).toBeNull()
    expect(parseDataTooltipIdSelector("[data-tooltip-id='a\\\\b']")).toBeNull()
    expect(parseDataTooltipIdSelector("[data-tooltip-id='a\\'b']")).toBe("a'b")
  })

  test.each([
    ["[data-tooltip-id='\\61 nchor']", 'anchor'],
    ["[data-tooltip-id='a\\\\b']", 'a\\b'],
  ])(
    'updates escaped selector %s when more than four selectors are registered',
    async (selector, id) => {
      const subscriber = jest.fn()
      subscribeAnchorSelector(selector, subscriber)
      for (let i = 0; i < 4; i++) {
        subscribeAnchorSelector(`[data-tooltip-id='other-${i}']`, jest.fn())
      }
      const anchor = document.createElement('button')
      anchor.dataset.tooltipId = id
      document.body.appendChild(anchor)
      expect(document.querySelector(selector)).toBe(anchor)
      controller.triggerAll([{ type: 'childList', addedNodes: [anchor], removedNodes: [] }])
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 32))
      })
      expect(subscriber).toHaveBeenLastCalledWith([anchor], null)
      anchor.removeAttribute('data-tooltip-id')
      controller.triggerAll([{ type: 'attributes', target: anchor, oldValue: id }])
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 32))
      })
      expect(subscriber).toHaveBeenLastCalledWith([], null)
    },
  )
})
