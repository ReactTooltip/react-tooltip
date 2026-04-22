type AnchorRegistrySubscriber = (anchors: HTMLElement[], error: Error | null) => void

type AnchorRegistryEntry = {
  anchors: HTMLElement[]
  error: Error | null
  subscribers: Set<AnchorRegistrySubscriber>
  /**
   * When the selector is a simple `[data-tooltip-id='value']` pattern,
   * this holds the extracted tooltip ID so we can skip expensive
   * querySelectorAll calls when the mutation doesn't affect it.
   */
  tooltipId: string | null
}

const registry = new Map<string, AnchorRegistryEntry>()

let documentObserver: MutationObserver | null = null

/**
 * Extract a tooltip ID from a simple `[data-tooltip-id='value']` selector.
 * Returns null for complex or custom selectors.
 */
function extractTooltipId(selector: string): string | null {
  const match = selector.match(/^\[data-tooltip-id=(['"])((?:\\.|(?!\1).)*)\1\]$/)
  return match ? match[2].replace(/\\(['"])/g, '$1') : null
}

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
  entry.subscribers.forEach((subscriber) => subscriber(entry.anchors, entry.error))
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

let refreshScheduled = false
let pendingTooltipIds: Set<string> | null = null
let pendingFullRefresh = false

function scheduleRefresh(affectedTooltipIds: Set<string> | null) {
  if (affectedTooltipIds) {
    if (!pendingTooltipIds) {
      pendingTooltipIds = new Set()
    }
    affectedTooltipIds.forEach((id) => pendingTooltipIds!.add(id))
  } else {
    pendingFullRefresh = true
  }

  if (refreshScheduled) {
    return
  }
  refreshScheduled = true

  const flush = () => {
    refreshScheduled = false
    const fullRefresh = pendingFullRefresh
    const ids = pendingTooltipIds
    pendingFullRefresh = false
    pendingTooltipIds = null

    if (fullRefresh) {
      refreshAllEntries()
    } else if (ids && ids.size > 0) {
      refreshEntriesForTooltipIds(ids)
    }
  }

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(flush)
  } else {
    Promise.resolve().then(flush)
  }
}

/**
 * Only refresh entries whose tooltipId is in the affected set,
 * plus any entries with custom (non-tooltipId) selectors.
 */
function refreshEntriesForTooltipIds(affectedIds: Set<string>) {
  registry.forEach((entry, selector) => {
    if (entry.tooltipId === null || affectedIds.has(entry.tooltipId)) {
      refreshEntry(selector, entry)
    }
  })
}

/**
 * Collect tooltip IDs from mutation records. Returns null when targeted
 * analysis is not worthwhile (few registry entries, or too many nodes to scan).
 */
function collectAffectedTooltipIds(records: MutationRecord[]): Set<string> | null {
  // Targeted refresh only pays off when there are many distinct selectors.
  // With few entries, full refresh is already cheap — skip the analysis overhead.
  if (registry.size <= 4) {
    return null
  }

  const ids = new Set<string>()

  for (const record of records) {
    if (record.type === 'attributes') {
      const target = record.target as HTMLElement
      const currentId = target.getAttribute?.('data-tooltip-id')
      if (currentId) ids.add(currentId)
      if (record.oldValue) ids.add(record.oldValue)
      continue
    }

    if (record.type === 'childList') {
      const gatherIds = (nodes: NodeList) => {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          if (node.nodeType !== Node.ELEMENT_NODE) continue
          const el = node as HTMLElement
          const id = el.getAttribute?.('data-tooltip-id')
          if (id) ids.add(id)
          // For large subtrees, bail out to full refresh to avoid double-scanning
          const descendants = el.querySelectorAll?.('[data-tooltip-id]')
          if (descendants) {
            if (descendants.length > 50) {
              return true // signal bail-out
            }
            for (let j = 0; j < descendants.length; j++) {
              const descId = descendants[j].getAttribute('data-tooltip-id')
              if (descId) ids.add(descId)
            }
          }
        }
        return false
      }
      if (gatherIds(record.addedNodes) || gatherIds(record.removedNodes)) {
        return null // large mutation — full refresh is cheaper
      }
      continue
    }
  }

  return ids
}

function ensureDocumentObserver() {
  if (documentObserver || typeof MutationObserver === 'undefined') {
    return
  }

  documentObserver = new MutationObserver((records) => {
    const affectedIds = collectAffectedTooltipIds(records)
    scheduleRefresh(affectedIds)
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
      tooltipId: extractTooltipId(selector),
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

/** @internal Reset module state between tests */
export function resetAnchorRegistry() {
  registry.clear()
  if (documentObserver) {
    documentObserver.disconnect()
    documentObserver = null
  }
  refreshScheduled = false
  pendingTooltipIds = null
  pendingFullRefresh = false
}
