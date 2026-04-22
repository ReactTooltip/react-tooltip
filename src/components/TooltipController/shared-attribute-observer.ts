/**
 * Shared MutationObserver for data-tooltip-* attribute changes.
 * Instead of N observers (one per tooltip), a single observer watches
 * all active anchors and dispatches changes to registered callbacks.
 */

type AttributeCallback = (element: HTMLElement) => void

const observedElements = new Map<HTMLElement, Set<AttributeCallback>>()

let sharedObserver: MutationObserver | null = null

const observerConfig: MutationObserverInit = {
  attributes: true,
  childList: false,
  subtree: false,
}

function getObserver(): MutationObserver {
  if (!sharedObserver) {
    sharedObserver = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (
          mutation.type !== 'attributes' ||
          !mutation.attributeName?.startsWith('data-tooltip-')
        ) {
          continue
        }
        const target = mutation.target as HTMLElement
        const callbacks = observedElements.get(target)
        if (callbacks) {
          callbacks.forEach((cb) => cb(target))
        }
      }
    })
  }
  return sharedObserver
}

export function observeAnchorAttributes(
  element: HTMLElement,
  callback: AttributeCallback,
): () => void {
  const observer = getObserver()
  let callbacks = observedElements.get(element)
  if (!callbacks) {
    callbacks = new Set()
    observedElements.set(element, callbacks)
    observer.observe(element, observerConfig)
  }
  callbacks.add(callback)

  return () => {
    const cbs = observedElements.get(element)
    if (cbs) {
      cbs.delete(callback)
      if (cbs.size === 0) {
        observedElements.delete(element)
        // MutationObserver doesn't have unobserve — if no elements left, disconnect & reset
        if (observedElements.size === 0) {
          observer.disconnect()
        } else {
          // Re-observe remaining elements (MutationObserver has no per-target unobserve)
          observer.disconnect()
          observedElements.forEach((_cbs, el) => {
            observer.observe(el, observerConfig)
          })
        }
      }
    }
  }
}

/**
 * Reset for testing purposes
 */
export function resetSharedAttributeObserver(): void {
  sharedObserver?.disconnect()
  sharedObserver = null
  observedElements.clear()
}
