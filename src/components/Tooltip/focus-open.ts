/**
 * Shared focus guards for every tooltip.
 *
 * One window listener records the focused element on window blur and ignores
 * the focus the browser fires for that element when the window returns.
 * `:focus-visible` decides whether any other focus should open a tooltip.
 * Mac Safari can miss `:focus-visible` when focus arrives from outside the
 * document, so that case follows the last key or pointer instead.
 */

const TYPEABLE_SELECTOR =
  "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])"

let restoredFocusElement: Element | null = null
let clearTimer: ReturnType<typeof setTimeout> | null = null
let listening = false
let subscribers = 0
let session = 0
let lastInputWasKeyboard = true

function isJSDOM(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')
}

function isMacSafari(): boolean {
  // JSDOM reports an Apple vendor. Never treat the test environment as Safari,
  // or a Mac platform string would skip :focus-visible entirely.
  if (isJSDOM() || typeof navigator === 'undefined') {
    return false
  }
  const isSafari =
    /apple/i.test(navigator.vendor) && !/chrome|android|crios|fxios/i.test(navigator.userAgent)
  const isMac = navigator.platform.toLowerCase().startsWith('mac') && !navigator.maxTouchPoints
  return isSafari && isMac
}

function isTypeableElement(element: EventTarget | null): boolean {
  return element instanceof HTMLElement && element.matches(TYPEABLE_SELECTOR)
}

function onKeyDown() {
  lastInputWasKeyboard = true
}

function onPointerDown() {
  lastInputWasKeyboard = false
}

function onWindowBlur() {
  const active = document.activeElement
  restoredFocusElement =
    active instanceof Element && active !== document.body && active !== document.documentElement
      ? active
      : null
  if (clearTimer !== null) {
    clearTimeout(clearTimer)
    clearTimer = null
  }
}

function scheduleClearRestoredFocus() {
  if (clearTimer !== null) {
    return
  }
  clearTimer = setTimeout(() => {
    restoredFocusElement = null
    clearTimer = null
  }, 0)
}

function onWindowFocus() {
  // Element focus can land in the same turn as window focus, or just before it.
  // Drop the record on the next turn so a later real Tab still opens.
  scheduleClearRestoredFocus()
}

function detach() {
  if (listening && typeof window !== 'undefined') {
    window.removeEventListener('blur', onWindowBlur)
    window.removeEventListener('focus', onWindowFocus)
    window.removeEventListener('keydown', onKeyDown, true)
    window.removeEventListener('pointerdown', onPointerDown, true)
  }
  listening = false
  restoredFocusElement = null
  lastInputWasKeyboard = true
  if (clearTimer !== null) {
    clearTimeout(clearTimer)
    clearTimer = null
  }
}

export function subscribeFocusOpenGuards(): () => void {
  const subscribedSession = session
  subscribers += 1
  if (!listening && typeof window !== 'undefined') {
    listening = true
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('pointerdown', onPointerDown, true)
  }

  return () => {
    if (subscribedSession !== session) {
      return
    }
    subscribers -= 1
    if (subscribers <= 0) {
      subscribers = 0
      detach()
    }
  }
}

export function isWindowRestoredFocus(target: EventTarget | null): boolean {
  if (!(target instanceof Node) || restoredFocusElement === null) {
    return false
  }
  const restored = target === restoredFocusElement || restoredFocusElement.contains(target)
  if (!restored) {
    // The user focused something else, so this was not a window restore.
    scheduleClearRestoredFocus()
    return false
  }
  // Keep the record until the next turn so every tooltip handler for this
  // event sees it, including when the browser never fires window focus.
  scheduleClearRestoredFocus()
  return true
}

export function shouldOpenOnVisibleFocus(event: Event): boolean {
  const { target } = event
  const relatedTarget = event instanceof FocusEvent ? event.relatedTarget : null

  if (isMacSafari() && !relatedTarget) {
    if (!lastInputWasKeyboard && !isTypeableElement(target)) {
      return false
    }
    return true
  }

  if (!(target instanceof Element)) {
    return false
  }
  // JSDOM parses :focus-visible but never matches it, which would hide every
  // keyboard tooltip under test. Old browsers that reject the selector throw.
  if (isJSDOM()) {
    return true
  }
  try {
    return target.matches(':focus-visible')
  } catch {
    return true
  }
}

export function resetFocusOpenGuards(): void {
  session += 1
  subscribers = 0
  detach()
}
