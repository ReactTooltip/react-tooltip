type AnchorRegistrySubscriber = (anchors: HTMLElement[], error: Error | null) => void

type AnchorRegistryEntry = {
  anchors: HTMLElement[]
  error: Error | null
  subscribers: Set<AnchorRegistrySubscriber>
}

const registry = new Map<string, AnchorRegistryEntry>()

let documentObserver: MutationObserver | null = null

function areAnchorListsEqual(left: HTMLElement[], right: HTMLElement[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((anchor, index) => anchor === right[index])
}

function readAnchorsForSelector(selector: string) {
  try {
    return {
      anchors: Array.from(document.querySelectorAll<HTMLElement>(selector)),
      error: null,
    }
  } catch (error) {
    return {
      anchors: [],
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

function notifySubscribers(entry: AnchorRegistryEntry) {
  const anchors = [...entry.anchors]
  entry.subscribers.forEach((subscriber) => subscriber(anchors, entry.error))
}

function refreshEntry(selector: string, entry: AnchorRegistryEntry) {
  const nextState = readAnchorsForSelector(selector)
  const nextErrorMessage = nextState.error?.message ?? null
  const previousErrorMessage = entry.error?.message ?? null

  if (
    areAnchorListsEqual(entry.anchors, nextState.anchors) &&
    nextErrorMessage === previousErrorMessage
  ) {
    return
  }

  const nextEntry = {
    ...entry,
    anchors: nextState.anchors,
    error: nextState.error,
  }

  registry.set(selector, nextEntry)
  notifySubscribers(nextEntry)
}

function refreshAllEntries() {
  registry.forEach((entry, selector) => {
    refreshEntry(selector, entry)
  })
}

function ensureDocumentObserver() {
  if (documentObserver || typeof MutationObserver === 'undefined') {
    return
  }

  documentObserver = new MutationObserver(() => {
    refreshAllEntries()
  })

  documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-tooltip-id'],
    attributeOldValue: true,
  })
}

function cleanupDocumentObserverIfUnused() {
  if (registry.size !== 0 || !documentObserver) {
    return
  }

  documentObserver.disconnect()
  documentObserver = null
}

export function subscribeAnchorSelector(selector: string, subscriber: AnchorRegistrySubscriber) {
  let entry = registry.get(selector)

  if (!entry) {
    const initialState = readAnchorsForSelector(selector)
    entry = {
      anchors: initialState.anchors,
      error: initialState.error,
      subscribers: new Set(),
    }
    registry.set(selector, entry)
  }

  entry.subscribers.add(subscriber)
  ensureDocumentObserver()
  subscriber([...entry.anchors], entry.error)

  return () => {
    const currentEntry = registry.get(selector)
    if (!currentEntry) {
      return
    }

    currentEntry.subscribers.delete(subscriber)
    if (currentEntry.subscribers.size === 0) {
      registry.delete(selector)
    }
    cleanupDocumentObserverIfUnused()
  }
}
