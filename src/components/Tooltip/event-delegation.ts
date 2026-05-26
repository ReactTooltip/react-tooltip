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

type DelegatedListener = {
  handlers: Set<Handler>
  dispatch: (event: Event) => void
  eventType: string
  capture: boolean
}

const handlersByType = new Map<string, DelegatedListener>()

function getListenerKey(eventType: string, capture: boolean): string {
  return `${eventType}:${capture ? 'capture' : 'bubble'}`
}

function getOrCreateListener(eventType: string, capture: boolean): DelegatedListener {
  const key = getListenerKey(eventType, capture)
  let listener = handlersByType.get(key)
  if (!listener) {
    const handlers = new Set<Handler>()
    const dispatch = (event: Event): void => {
      handlers.forEach((handler) => {
        handler(event)
      })
    }
    listener = { handlers, dispatch, eventType, capture }
    handlersByType.set(key, listener)
    document.addEventListener(eventType, dispatch, { capture })
  }
  return listener
}

/**
 * Register a handler for a document-level event type.
 * Returns an unsubscribe function.
 */
export function addDelegatedEventListener(
  eventType: string,
  handler: Handler,
  options: AddEventListenerOptions = {},
): () => void {
  const capture = Boolean(options.capture)
  const key = getListenerKey(eventType, capture)
  const listener = getOrCreateListener(eventType, capture)
  listener.handlers.add(handler)

  return () => {
    listener.handlers.delete(handler)
    if (listener.handlers.size === 0) {
      handlersByType.delete(key)
      document.removeEventListener(eventType, listener.dispatch, { capture })
    }
  }
}

/**
 * Reset for testing purposes.
 */
export function resetEventDelegation(): void {
  handlersByType.forEach((listener) => {
    document.removeEventListener(listener.eventType, listener.dispatch, {
      capture: listener.capture,
    })
  })
  handlersByType.clear()
}
