import { useCallback, useEffect, useRef, useState } from 'react'
import { cssTimeToMs, useIsomorphicLayoutEffect } from '../../utils'

// Shared across all tooltip instances — the CSS variable is on :root and never changes per-instance
let globalTransitionShowDelay: number | null = null

const getMissedTransitionDelay = () => {
  if (globalTransitionShowDelay === null) {
    const style = getComputedStyle(document.body)
    globalTransitionShowDelay = cssTimeToMs(style.getPropertyValue('--rt-transition-show-delay'))
  }
  // +25ms just to make sure `onTransitionEnd` (if it gets fired) has time to run
  return globalTransitionShowDelay + 25
}

/**
 * Takes a tooltip out of the DOM once it is neither showing nor asked to show,
 * and calls `afterHide` if it had shown.
 *
 * The tooltip is rendered a moment before it shows, and stays rendered while it fades out.
 * The closing transition ends that (see the returned `onTransitionEnd` handler).
 * A timer ends it when no transition runs:
 * - the tooltip showed and closed too fast for the transition to start
 * - the tooltip closed before it showed, so `show` never changed
 * - a controlled `isOpen` never let the tooltip show
 */
const useTooltipRemoval = ({
  rendered,
  show,
  showRequested,
  afterHide,
  onRemove,
}: {
  rendered: boolean
  show: boolean
  /** the tooltip was asked to show, and `show` follows a moment later */
  showRequested: boolean
  afterHide?: () => void
  onRemove: () => void
}) => {
  /**
   * the timer and the transition end only mark the removal as due.
   * either can run in the same turn as a request to show that has not rendered yet,
   * and removing the tooltip right there would take it out just as it shows again
   */
  const [removalDue, setRemovalDue] = useState(false)
  // the tooltip showed, and `afterHide` has not been called for it yet
  const afterHidePending = useRef(false)

  useEffect(() => {
    if (show) {
      afterHidePending.current = true
    }
  }, [show])

  useEffect(() => {
    if (show || showRequested || (!rendered && !afterHidePending.current)) {
      return undefined
    }
    const timer = setTimeout(() => {
      setRemovalDue(true)
    }, getMissedTransitionDelay())
    return () => {
      clearTimeout(timer)
    }
  }, [rendered, show, showRequested])

  /**
   * `show` and `showRequested` are current here, so this is where a due removal
   * is carried out or dropped. a layout effect, so the tooltip is gone before the next paint
   */
  useIsomorphicLayoutEffect(() => {
    if (!removalDue) {
      return
    }
    setRemovalDue(false)
    if (show || showRequested) {
      return
    }
    onRemove()
    if (afterHidePending.current) {
      afterHidePending.current = false
      afterHide?.()
    }
  }, [removalDue, show, showRequested, onRemove, afterHide])

  return useCallback(
    (event: TransitionEvent) => {
      if (!show && event.propertyName === 'opacity') {
        setRemovalDue(true)
      }
    },
    [show],
  )
}

export default useTooltipRemoval
