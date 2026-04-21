import { subscribeAnchorSelector, resetAnchorRegistry } from '../components/Tooltip/anchor-registry'
import { installMockMutationObserver } from './mutation-observer-test-utils'
import { act } from '@testing-library/react'

describe('anchor registry', () => {
  let mutationObserverController

  beforeEach(() => {
    resetAnchorRegistry()
    document.body.innerHTML = ''
    mutationObserverController = installMockMutationObserver()
  })

  afterEach(() => {
    resetAnchorRegistry()
    mutationObserverController.restore()
    document.body.innerHTML = ''
  })

  test('updates subscribers when matching anchors change', async () => {
    const initialAnchor = document.createElement('button')
    initialAnchor.dataset.tooltipId = 'registry-test'
    document.body.appendChild(initialAnchor)

    const subscriber = jest.fn()
    const unsubscribe = subscribeAnchorSelector("[data-tooltip-id='registry-test']", subscriber)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenLastCalledWith([initialAnchor], null)
    expect(mutationObserverController.instances).toHaveLength(1)

    const nextAnchor = document.createElement('button')
    nextAnchor.dataset.tooltipId = 'registry-test'
    document.body.appendChild(nextAnchor)

    mutationObserverController.triggerAll([
      {
        type: 'childList',
        addedNodes: [nextAnchor],
        removedNodes: [],
      },
    ])

    // The registry debounces refresh via rAF — flush it
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 16))
    })

    expect(subscriber).toHaveBeenCalledTimes(2)
    expect(subscriber).toHaveBeenLastCalledWith([initialAnchor, nextAnchor], null)

    unsubscribe()

    expect(mutationObserverController.instances[0].disconnect).toHaveBeenCalledTimes(1)
  })

  test('ignores repeated cleanup for the same subscription', () => {
    const anchor = document.createElement('button')
    anchor.dataset.tooltipId = 'registry-cleanup'
    document.body.appendChild(anchor)

    const unsubscribe = subscribeAnchorSelector("[data-tooltip-id='registry-cleanup']", jest.fn())

    unsubscribe()

    expect(() => unsubscribe()).not.toThrow()
    expect(mutationObserverController.instances[0].disconnect).toHaveBeenCalledTimes(1)
  })
})
