import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { autoUpdate } from '@floating-ui/dom'
import {
  debounce,
  getScrollParent,
  clearTimeoutRef,
  parseDataTooltipIdSelector,
  resolveDataTooltipAnchor,
} from '../../utils'
import type {
  AnchorCloseEvents,
  AnchorOpenEvents,
  GlobalCloseEvents,
  IPosition,
} from './TooltipTypes'
import { addDelegatedEventListener } from './event-delegation'

const useTooltipEvents = ({
  activeAnchor,
  anchorElements,
  anchorSelector,
  clickable,
  closeEvents,
  delayHide,
  delayShow,
  disableTooltip,
  float,
  globalCloseEvents,
  handleHideTooltipDelayed,
  handleShow,
  handleShowTooltipDelayed,
  handleTooltipPosition,
  hoveringTooltip,
  imperativeModeOnly,
  lastFloatPosition,
  openEvents,
  openOnClick,
  setActiveAnchor,
  show,
  tooltipHideDelayTimerRef,
  tooltipRef,
  tooltipShowDelayTimerRef,
  updateTooltipPosition,
}: {
  activeAnchor: HTMLElement | null
  anchorElements: HTMLElement[]
  anchorSelector: string
  clickable: boolean
  closeEvents?: AnchorCloseEvents
  delayHide: number
  delayShow: number
  disableTooltip?: (anchorRef: HTMLElement | null) => boolean
  float: boolean
  globalCloseEvents?: GlobalCloseEvents
  handleHideTooltipDelayed: (delay?: number) => void
  handleShow: (value: boolean) => void
  handleShowTooltipDelayed: (delay?: number) => void
  handleTooltipPosition: ({ x, y }: IPosition) => void
  hoveringTooltip: MutableRefObject<boolean>
  imperativeModeOnly?: boolean
  lastFloatPosition: MutableRefObject<IPosition | null>
  openEvents?: AnchorOpenEvents
  openOnClick: boolean
  setActiveAnchor: (anchor: HTMLElement | null) => void
  show: boolean
  tooltipHideDelayTimerRef: MutableRefObject<NodeJS.Timeout | null>
  tooltipRef: MutableRefObject<HTMLElement | null>
  tooltipShowDelayTimerRef: MutableRefObject<NodeJS.Timeout | null>
  updateTooltipPosition: () => void
}) => {
  // Ref-stable debounced handlers — avoids recreating debounce instances on every effect run
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedShowRef = useRef(debounce((_anchor: HTMLElement | null) => {}, 50, true))
  const debouncedHideRef = useRef(debounce(() => {}, 50, true))

  // Cache scroll parents — only recompute when the element actually changes
  const anchorScrollParentRef = useRef<Element | null>(null)
  const tooltipScrollParentRef = useRef<Element | null>(null)
  const prevAnchorRef = useRef<HTMLElement | null>(null)
  const prevTooltipRef = useRef<HTMLElement | null>(null)

  if (activeAnchor !== prevAnchorRef.current) {
    prevAnchorRef.current = activeAnchor
    anchorScrollParentRef.current = getScrollParent(activeAnchor)
  }
  const currentTooltipEl = tooltipRef.current
  if (currentTooltipEl !== prevTooltipRef.current) {
    prevTooltipRef.current = currentTooltipEl
    tooltipScrollParentRef.current = getScrollParent(currentTooltipEl)
  }

  // Memoize event config objects — only rebuild when the relevant props change
  const hasClickEvent =
    openOnClick || openEvents?.click || openEvents?.dblclick || openEvents?.mousedown
  const actualOpenEvents: AnchorOpenEvents = useMemo(() => {
    const events: AnchorOpenEvents = openEvents
      ? { ...openEvents }
      : {
          mouseenter: true,
          focus: true,
          click: false,
          dblclick: false,
          mousedown: false,
        }
    if (!openEvents && openOnClick) {
      Object.assign(events, {
        mouseenter: false,
        focus: false,
        click: true,
      })
    }
    if (imperativeModeOnly) {
      Object.assign(events, {
        mouseenter: false,
        focus: false,
        click: false,
        dblclick: false,
        mousedown: false,
      })
    }
    return events
  }, [openEvents, openOnClick, imperativeModeOnly])

  const actualCloseEvents: AnchorCloseEvents = useMemo(() => {
    const events: AnchorCloseEvents = closeEvents
      ? { ...closeEvents }
      : {
          mouseleave: true,
          blur: true,
          click: false,
          dblclick: false,
          mouseup: false,
        }
    if (!closeEvents && openOnClick) {
      Object.assign(events, {
        mouseleave: false,
        blur: false,
      })
    }
    if (imperativeModeOnly) {
      Object.assign(events, {
        mouseleave: false,
        blur: false,
        click: false,
        dblclick: false,
        mouseup: false,
      })
    }
    return events
  }, [closeEvents, openOnClick, imperativeModeOnly])

  const actualGlobalCloseEvents: GlobalCloseEvents = useMemo(() => {
    const events: GlobalCloseEvents = globalCloseEvents
      ? { ...globalCloseEvents }
      : {
          escape: false,
          scroll: false,
          resize: false,
          clickOutsideAnchor: hasClickEvent || false,
        }
    if (imperativeModeOnly) {
      Object.assign(events, {
        escape: false,
        scroll: false,
        resize: false,
        clickOutsideAnchor: false,
      })
    }
    return events
  }, [globalCloseEvents, hasClickEvent, imperativeModeOnly])

  // --- Refs for values read inside event handlers (avoids effect deps) ---
  const activeAnchorRef = useRef(activeAnchor)
  activeAnchorRef.current = activeAnchor
  const showRef = useRef(show)
  showRef.current = show
  const anchorElementsRef = useRef(anchorElements)
  anchorElementsRef.current = anchorElements
  const handleShowRef = useRef(handleShow)
  handleShowRef.current = handleShow
  const handleTooltipPositionRef = useRef(handleTooltipPosition)
  handleTooltipPositionRef.current = handleTooltipPosition
  const updateTooltipPositionRef = useRef(updateTooltipPosition)
  updateTooltipPositionRef.current = updateTooltipPosition

  // --- Handler refs (updated every render, read via ref indirection in effects) ---
  const resolveAnchorElementRef = useRef<(target: EventTarget | null) => HTMLElement | null>(
    () => null,
  )
  const handleShowTooltipRef = useRef<(anchor: HTMLElement | null) => void>(() => {})
  const handleHideTooltipRef = useRef<() => void>(() => {})

  const dataTooltipId = anchorSelector ? parseDataTooltipIdSelector(anchorSelector) : null

  resolveAnchorElementRef.current = (target: EventTarget | null) => {
    const targetElement = target as HTMLElement | null

    if (!targetElement?.isConnected) {
      return null
    }

    if (dataTooltipId) {
      const matchedAnchor = resolveDataTooltipAnchor(targetElement, dataTooltipId)

      if (matchedAnchor && !disableTooltip?.(matchedAnchor)) {
        return matchedAnchor
      }
    } else if (anchorSelector) {
      try {
        const matchedAnchor =
          (targetElement.matches(anchorSelector)
            ? targetElement
            : targetElement.closest(anchorSelector)) ?? null

        if (matchedAnchor && !disableTooltip?.(matchedAnchor as HTMLElement)) {
          return matchedAnchor as HTMLElement
        }
      } catch {
        return null
      }
    }

    return (
      anchorElementsRef.current.find(
        (anchor) => anchor === targetElement || anchor.contains(targetElement),
      ) ?? null
    )
  }

  handleShowTooltipRef.current = (anchor: HTMLElement | null) => {
    if (!anchor) {
      return
    }
    if (!anchor.isConnected) {
      setActiveAnchor(null)
      return
    }
    if (disableTooltip?.(anchor)) {
      return
    }
    if (delayShow) {
      handleShowTooltipDelayed()
    } else {
      handleShow(true)
    }
    if (delayShow && activeAnchorRef.current && anchor !== activeAnchorRef.current) {
      // Moving to a different anchor while one is already active — defer the anchor
      // switch until the show delay fires to prevent content/position from updating
      // before visibility transitions complete.
      if (tooltipShowDelayTimerRef.current) {
        clearTimeout(tooltipShowDelayTimerRef.current)
      }
      tooltipShowDelayTimerRef.current = setTimeout(() => {
        setActiveAnchor(anchor)
        handleShow(true)
      }, delayShow)
    } else {
      setActiveAnchor(anchor)
    }

    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }
  }

  handleHideTooltipRef.current = () => {
    if (clickable) {
      handleHideTooltipDelayed(delayHide || 100)
    } else if (delayHide) {
      handleHideTooltipDelayed()
    } else {
      handleShow(false)
    }

    if (tooltipShowDelayTimerRef.current) {
      clearTimeout(tooltipShowDelayTimerRef.current)
    }
  }

  // Update debounced callbacks to always delegate to latest handler refs
  const debouncedShow = debouncedShowRef.current
  const debouncedHide = debouncedHideRef.current
  debouncedShow.setCallback((anchor: HTMLElement | null) => handleShowTooltipRef.current(anchor))
  debouncedHide.setCallback(() => handleHideTooltipRef.current())

  // --- Effect 1: Delegated anchor events + tooltip hover ---
  // Only re-runs when the set of active event types or interaction mode changes.
  // Handlers read reactive values (activeAnchor, show, etc.) from refs at invocation
  // time, so this effect is decoupled from show/hide state changes.
  useEffect(() => {
    const cleanupFns: (() => void)[] = []

    const addDelegatedListener = (eventType: string, listener: (event: Event) => void) => {
      cleanupFns.push(addDelegatedEventListener(eventType, listener))
    }

    const activeAnchorContainsTarget = (event?: Event): boolean =>
      Boolean(event?.target && activeAnchorRef.current?.contains(event.target as HTMLElement))

    const debouncedHandleShowTooltip = (anchor: HTMLElement | null) => {
      debouncedHide.cancel()
      debouncedShow(anchor)
    }
    const debouncedHandleHideTooltip = () => {
      debouncedShow.cancel()
      debouncedHide()
    }

    const addDelegatedHoverOpenListener = () => {
      addDelegatedListener('mouseover', (event) => {
        const anchor = resolveAnchorElementRef.current(event.target)
        if (!anchor) {
          return
        }
        const relatedAnchor = resolveAnchorElementRef.current((event as MouseEvent).relatedTarget)
        if (relatedAnchor === anchor) {
          return
        }
        debouncedHandleShowTooltip(anchor)
      })
    }

    const addDelegatedHoverCloseListener = () => {
      addDelegatedListener('mouseout', (event) => {
        if (!activeAnchorContainsTarget(event)) {
          return
        }
        const relatedTarget = (event as MouseEvent).relatedTarget as HTMLElement | null
        if (activeAnchorRef.current?.contains(relatedTarget)) {
          return
        }
        debouncedHandleHideTooltip()
      })
    }

    if (actualOpenEvents.mouseenter) {
      addDelegatedHoverOpenListener()
    }
    if (actualCloseEvents.mouseleave) {
      addDelegatedHoverCloseListener()
    }
    if (actualOpenEvents.mouseover) {
      addDelegatedHoverOpenListener()
    }
    if (actualCloseEvents.mouseout) {
      addDelegatedHoverCloseListener()
    }
    if (actualOpenEvents.focus) {
      addDelegatedListener('focusin', (event) => {
        debouncedHandleShowTooltip(resolveAnchorElementRef.current(event.target))
      })
    }
    if (actualCloseEvents.blur) {
      addDelegatedListener('focusout', (event) => {
        if (!activeAnchorContainsTarget(event)) {
          return
        }
        const relatedTarget = (event as FocusEvent).relatedTarget as HTMLElement | null
        if (activeAnchorRef.current?.contains(relatedTarget)) {
          return
        }
        debouncedHandleHideTooltip()
      })
    }

    const regularEvents = ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'focus', 'blur']
    const clickEvents = ['click', 'dblclick', 'mousedown', 'mouseup']

    const handleClickOpenTooltipAnchor = (event?: Event) => {
      const anchor = resolveAnchorElementRef.current(event?.target ?? null)
      if (!anchor) {
        return
      }
      if (showRef.current && activeAnchorRef.current === anchor) {
        return
      }
      handleShowTooltipRef.current(anchor)
    }
    const handleClickCloseTooltipAnchor = (event?: Event) => {
      if (!showRef.current || !activeAnchorContainsTarget(event)) {
        return
      }
      handleHideTooltipRef.current()
    }

    Object.entries(actualOpenEvents).forEach(([event, enabled]) => {
      if (!enabled || regularEvents.includes(event)) {
        return
      }
      if (clickEvents.includes(event)) {
        addDelegatedListener(event, handleClickOpenTooltipAnchor as (event: Event) => void)
      }
    })

    Object.entries(actualCloseEvents).forEach(([event, enabled]) => {
      if (!enabled || regularEvents.includes(event)) {
        return
      }
      if (clickEvents.includes(event)) {
        addDelegatedListener(event, handleClickCloseTooltipAnchor as (event: Event) => void)
      }
    })

    if (float) {
      addDelegatedListener('pointermove', (event) => {
        const currentActiveAnchor = activeAnchorRef.current
        if (!currentActiveAnchor) {
          return
        }
        const targetAnchor = resolveAnchorElementRef.current(event.target)
        if (targetAnchor !== currentActiveAnchor) {
          return
        }
        const mouseEvent = event as MouseEvent
        const mousePosition = {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        }
        handleTooltipPositionRef.current(mousePosition)
        lastFloatPosition.current = mousePosition
      })
    }

    const tooltipElement = tooltipRef.current
    const handleMouseOverTooltip = () => {
      hoveringTooltip.current = true
    }
    const handleMouseOutTooltip = () => {
      hoveringTooltip.current = false
      handleHideTooltipRef.current()
    }

    const addHoveringTooltipListeners =
      clickable && (actualCloseEvents.mouseout || actualCloseEvents.mouseleave)
    if (addHoveringTooltipListeners) {
      tooltipElement?.addEventListener('mouseover', handleMouseOverTooltip)
      tooltipElement?.addEventListener('mouseout', handleMouseOutTooltip)
    }

    return () => {
      cleanupFns.forEach((fn) => fn())
      if (addHoveringTooltipListeners) {
        tooltipElement?.removeEventListener('mouseover', handleMouseOverTooltip)
        tooltipElement?.removeEventListener('mouseout', handleMouseOutTooltip)
      }
      debouncedShow.cancel()
      debouncedHide.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualOpenEvents, actualCloseEvents, float, clickable])

  // --- Effect 2: Global close events + auto-update ---
  // Re-runs when the global close config changes, or when the active anchor changes
  // (for scroll parent listeners and floating-ui autoUpdate).
  useEffect(() => {
    const handleScrollResize = () => {
      handleShowRef.current(false)
    }

    const tooltipScrollParent = tooltipScrollParentRef.current
    const anchorScrollParent = anchorScrollParentRef.current

    if (actualGlobalCloseEvents.scroll) {
      window.addEventListener('scroll', handleScrollResize)
      anchorScrollParent?.addEventListener('scroll', handleScrollResize)
      tooltipScrollParent?.addEventListener('scroll', handleScrollResize)
    }
    let updateTooltipCleanup: null | (() => void) = null
    if (actualGlobalCloseEvents.resize) {
      window.addEventListener('resize', handleScrollResize)
    } else if (activeAnchor && tooltipRef.current) {
      updateTooltipCleanup = autoUpdate(
        activeAnchor as HTMLElement,
        tooltipRef.current as HTMLElement,
        () => updateTooltipPositionRef.current(),
        {
          ancestorResize: true,
          elementResize: true,
          layoutShift: true,
        },
      )
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      handleShowRef.current(false)
    }
    if (actualGlobalCloseEvents.escape) {
      window.addEventListener('keydown', handleEsc)
    }

    const handleClickOutsideAnchors = (event: Event) => {
      if (!showRef.current) {
        return
      }
      const target = (event as MouseEvent).target as HTMLElement
      if (!target?.isConnected) {
        return
      }
      if (tooltipRef.current?.contains(target)) {
        return
      }
      if (activeAnchorRef.current?.contains(target)) {
        return
      }
      if (anchorElementsRef.current.some((anchor) => anchor?.contains(target))) {
        return
      }
      handleShowRef.current(false)
      clearTimeoutRef(tooltipShowDelayTimerRef)
    }

    if (actualGlobalCloseEvents.clickOutsideAnchor) {
      window.addEventListener('click', handleClickOutsideAnchors)
    }

    return () => {
      if (actualGlobalCloseEvents.scroll) {
        window.removeEventListener('scroll', handleScrollResize)
        anchorScrollParent?.removeEventListener('scroll', handleScrollResize)
        tooltipScrollParent?.removeEventListener('scroll', handleScrollResize)
      }
      if (actualGlobalCloseEvents.resize) {
        window.removeEventListener('resize', handleScrollResize)
      }
      if (updateTooltipCleanup) {
        updateTooltipCleanup()
      }
      if (actualGlobalCloseEvents.escape) {
        window.removeEventListener('keydown', handleEsc)
      }
      if (actualGlobalCloseEvents.clickOutsideAnchor) {
        window.removeEventListener('click', handleClickOutsideAnchors)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualGlobalCloseEvents, activeAnchor])
}

export default useTooltipEvents
