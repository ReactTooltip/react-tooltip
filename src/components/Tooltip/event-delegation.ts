/**
 * Shared document event delegation.
 *
 * Instead of N tooltips each calling document.addEventListener(type, handler),
 * we maintain ONE document listener per event type. When the event fires,
 * we iterate through all registered handlers for that type.
 *
 * This reduces document-level listeners from O(N × eventTypes) to O(eventTypes).
 */

type Handler = (event: Event) => void

const handlersByType = new Map<string, Set<Handler>>()

function getOrCreateSet(eventType: string): Set<Handler> {
  let set = handlersByType.get(eventType)
  if (!set) {
    set = new Set()
    handlersByType.set(eventType, set)
    document.addEventListener(eventType, dispatch)
  }
  return set
}

function dispatch(event: Event): void {
  const handlers = handlersByType.get(event.type)
  if (handlers) {
    // Safe to iterate directly — mutations (add/remove) only happen in
    // setup/cleanup, not during dispatch. Set iteration is stable for
    // entries that existed when iteration began.
    handlers.forEach((handler) => {
      handler(event)
    })
  }
}

/**
 * Register a handler for a document-level event type.
 * Returns an unsubscribe function.
 */
export function addDelegatedEventListener(eventType: string, handler: Handler): () => void {
  const set = getOrCreateSet(eventType)
  set.add(handler)

  return () => {
    set.delete(handler)
    if (set.size === 0) {
      handlersByType.delete(eventType)
      document.removeEventListener(eventType, dispatch)
    }
  }
}

/**
 * Reset for testing purposes.
 */
export function resetEventDelegation(): void {
  handlersByType.forEach((_handlers, eventType) => {
    document.removeEventListener(eventType, dispatch)
  })
  handlersByType.clear()
}
