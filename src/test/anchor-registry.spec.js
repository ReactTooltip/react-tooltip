import { subscribeAnchorSelector } from '../components/Tooltip/anchor-registry'
import { installMockMutationObserver } from './mutation-observer-test-utils'

describe('anchor registry', () => {
  let mutationObserverController

  beforeEach(() => {
    document.body.innerHTML = ''
    mutationObserverController = installMockMutationObserver()
  })

  afterEach(() => {
    mutationObserverController.restore()
    document.body.innerHTML = ''
  })

  test('updates subscribers when matching anchors change', () => {
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
