import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { cssTimeToMs, useIsomorphicLayoutEffect } from '../../utils'

/**
 * the removal waits as long as the closing transition takes.
 * read on the tooltip, where the transition runs,
 * so the variable can be set on the tooltip or on any of its ancestors
 */
const getMissedTransitionDelay = (tooltip: HTMLElement | null) => {
  const style = getComputedStyle(tooltip ?? document.body)
  // a custom property keeps an expression such as `calc()` as written, which reads as 0 here.
  // the closing transition that uses it has it resolved
  const delay =
    cssTimeToMs(style.getPropertyValue('--rt-transition-closing-delay').trim()) ||
    cssTimeToMs(style.transitionDuration.split(',')[0].trim())
  // +25ms just to make sure `onTransitionEnd` (if it gets fired) has time to run
  return delay + 25
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
  tooltipRef,
}: {
  rendered: boolean
  show: boolean
  /** the tooltip was asked to show, and `show` follows a moment later */
  showRequested: boolean
  afterHide?: () => void
  onRemove: () => void
  tooltipRef: RefObject<HTMLElement | null>
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
    }, getMissedTransitionDelay(tooltipRef.current))
    return () => {
      clearTimeout(timer)
    }
  }, [rendered, show, showRequested, tooltipRef])

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
      // the tooltip's own fade, not a transition inside its content that bubbled up
      if (!show && event.target === event.currentTarget && event.propertyName === 'opacity') {
        setRemovalDue(true)
      }
    },
    [show],
  )
}

export default useTooltipRemoval
