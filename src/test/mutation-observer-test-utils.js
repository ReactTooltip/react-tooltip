import { act } from '@testing-library/react'

export function installMockMutationObserver() {
  const OriginalMutationObserver = global.MutationObserver
  const instances = []

  class MockMutationObserver {
    constructor(callback) {
      this.callback = callback
      this.observe = jest.fn()
      this.disconnect = jest.fn()
      this.takeRecords = jest.fn().mockReturnValue([])
      instances.push(this)
    }
  }

  global.MutationObserver = MockMutationObserver

  return {
    instances,
    triggerAll(records) {
      act(() => {
        instances.forEach((instance) => {
          instance.callback(records)
        })
      })
    },
    restore() {
      global.MutationObserver = OriginalMutationObserver
    },
  }
}
