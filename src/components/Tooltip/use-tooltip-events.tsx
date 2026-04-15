import { useEffect } from 'react'
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
  useEffect(() => {
    const dataTooltipId = anchorSelector ? parseDataTooltipIdSelector(anchorSelector) : null

    const resolveAnchorElement = (target: EventTarget | null) => {
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
        anchorElements.find(
          (anchor) => anchor === targetElement || anchor.contains(targetElement),
        ) ?? null
      )
    }

    const handlePointerMove = (event?: Event) => {
      if (!event) {
        return
      }
      if (!activeAnchor) {
        return
      }
      const targetAnchor = resolveAnchorElement(event.target)
      if (targetAnchor !== activeAnchor) {
        return
      }
      const mouseEvent = event as MouseEvent
      const mousePosition = {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      }
      handleTooltipPosition(mousePosition)

      lastFloatPosition.current = mousePosition
    }

    const handleClickOutsideAnchors = (event: MouseEvent) => {
      if (!show) {
        return
      }
      const target = event.target as HTMLElement
      if (!target?.isConnected) {
        return
      }
      if (tooltipRef.current?.contains(target)) {
        return
      }
      if (activeAnchor?.contains(target)) {
        return
      }
      if (anchorElements.some((anchor) => anchor?.contains(target))) {
        return
      }
      handleShow(false)
      clearTimeoutRef(tooltipShowDelayTimerRef)
    }

    const handleShowTooltip = (anchor: HTMLElement | null) => {
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
      if (delayShow && activeAnchor && anchor !== activeAnchor) {
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

    const handleHideTooltip = () => {
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

    const internalDebouncedHandleShowTooltip = debounce(handleShowTooltip, 50, true)
    const internalDebouncedHandleHideTooltip = debounce(handleHideTooltip, 50, true)
    const debouncedHandleShowTooltip = (anchor: HTMLElement | null) => {
      internalDebouncedHandleHideTooltip.cancel()
      internalDebouncedHandleShowTooltip(anchor)
    }
    const debouncedHandleHideTooltip = () => {
      internalDebouncedHandleShowTooltip.cancel()
      internalDebouncedHandleHideTooltip()
    }

    const handleScrollResize = () => {
      handleShow(false)
    }

    const hasClickEvent =
      openOnClick || openEvents?.click || openEvents?.dblclick || openEvents?.mousedown
    const actualOpenEvents: AnchorOpenEvents = openEvents
      ? { ...openEvents }
      : {
          mouseenter: true,
          focus: true,
          click: false,
          dblclick: false,
          mousedown: false,
        }
    if (!openEvents && openOnClick) {
      Object.assign(actualOpenEvents, {
        mouseenter: false,
        focus: false,
        click: true,
      })
    }
    const actualCloseEvents: AnchorCloseEvents = closeEvents
      ? { ...closeEvents }
      : {
          mouseleave: true,
          blur: true,
          click: false,
          dblclick: false,
          mouseup: false,
        }
    if (!closeEvents && openOnClick) {
      Object.assign(actualCloseEvents, {
        mouseleave: false,
        blur: false,
      })
    }
    const actualGlobalCloseEvents: GlobalCloseEvents = globalCloseEvents
      ? { ...globalCloseEvents }
      : {
          escape: false,
          scroll: false,
          resize: false,
          clickOutsideAnchor: hasClickEvent || false,
        }

    if (imperativeModeOnly) {
      Object.assign(actualOpenEvents, {
        mouseenter: false,
        focus: false,
        click: false,
        dblclick: false,
        mousedown: false,
      })
      Object.assign(actualCloseEvents, {
        mouseleave: false,
        blur: false,
        click: false,
        dblclick: false,
        mouseup: false,
      })
      Object.assign(actualGlobalCloseEvents, {
        escape: false,
        scroll: false,
        resize: false,
        clickOutsideAnchor: false,
      })
    }

    const tooltipElement = tooltipRef.current
    const tooltipScrollParent = getScrollParent(tooltipRef.current)
    const anchorScrollParent = getScrollParent(activeAnchor)

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
        updateTooltipPosition,
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
      handleShow(false)
    }
    if (actualGlobalCloseEvents.escape) {
      window.addEventListener('keydown', handleEsc)
    }

    if (actualGlobalCloseEvents.clickOutsideAnchor) {
      window.addEventListener('click', handleClickOutsideAnchors)
    }

    const activeAnchorContainsTarget = (event?: Event): boolean =>
      Boolean(event?.target && activeAnchor?.contains(event.target as HTMLElement))
    const handleClickOpenTooltipAnchor = (event?: Event) => {
      const anchor = resolveAnchorElement(event?.target ?? null)
      if (!anchor) {
        return
      }
      if (show && activeAnchor === anchor) {
        return
      }
      handleShowTooltip(anchor)
    }
    const handleClickCloseTooltipAnchor = (event?: Event) => {
      if (!show || !activeAnchorContainsTarget(event)) {
        return
      }
      handleHideTooltip()
    }

    const regularEvents = ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'focus', 'blur']
    const clickEvents = ['click', 'dblclick', 'mousedown', 'mouseup']
    const delegatedEvents: { event: string; listener: (event: Event) => void }[] = []

    const addDelegatedHoverOpenListener = () => {
      delegatedEvents.push({
        event: 'mouseover',
        listener: (event) => {
          const anchor = resolveAnchorElement(event.target)
          if (!anchor) {
            return
          }
          const relatedAnchor = resolveAnchorElement((event as MouseEvent).relatedTarget)
          if (relatedAnchor === anchor) {
            return
          }
          debouncedHandleShowTooltip(anchor)
        },
      })
    }

    const addDelegatedHoverCloseListener = () => {
      delegatedEvents.push({
        event: 'mouseout',
        listener: (event) => {
          if (!activeAnchorContainsTarget(event)) {
            return
          }
          const relatedTarget = (event as MouseEvent).relatedTarget as HTMLElement | null
          if (activeAnchor?.contains(relatedTarget)) {
            return
          }
          debouncedHandleHideTooltip()
        },
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
      delegatedEvents.push({
        event: 'focusin',
        listener: (event) => {
          debouncedHandleShowTooltip(resolveAnchorElement(event.target))
        },
      })
    }
    if (actualCloseEvents.blur) {
      delegatedEvents.push({
        event: 'focusout',
        listener: (event) => {
          if (!activeAnchorContainsTarget(event)) {
            return
          }
          const relatedTarget = (event as FocusEvent).relatedTarget as HTMLElement | null
          if (activeAnchor?.contains(relatedTarget)) {
            return
          }
          debouncedHandleHideTooltip()
        },
      })
    }

    Object.entries(actualOpenEvents).forEach(([event, enabled]) => {
      if (!enabled || regularEvents.includes(event)) {
        return
      }
      if (clickEvents.includes(event)) {
        delegatedEvents.push({
          event,
          listener: handleClickOpenTooltipAnchor as (event: Event) => void,
        })
      }
    })

    Object.entries(actualCloseEvents).forEach(([event, enabled]) => {
      if (!enabled || regularEvents.includes(event)) {
        return
      }
      if (clickEvents.includes(event)) {
        delegatedEvents.push({
          event,
          listener: handleClickCloseTooltipAnchor as (event: Event) => void,
        })
      }
    })

    if (float) {
      delegatedEvents.push({
        event: 'pointermove',
        listener: handlePointerMove as (event: Event) => void,
      })
    }

    const handleMouseOverTooltip = () => {
      hoveringTooltip.current = true
    }
    const handleMouseOutTooltip = () => {
      hoveringTooltip.current = false
      handleHideTooltip()
    }

    const addHoveringTooltipListeners =
      clickable && (actualCloseEvents.mouseout || actualCloseEvents.mouseleave)
    if (addHoveringTooltipListeners) {
      tooltipElement?.addEventListener('mouseover', handleMouseOverTooltip)
      tooltipElement?.addEventListener('mouseout', handleMouseOutTooltip)
    }

    delegatedEvents.forEach(({ event, listener }) => {
      document.addEventListener(event, listener)
    })

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

      if (actualGlobalCloseEvents.clickOutsideAnchor) {
        window.removeEventListener('click', handleClickOutsideAnchors)
      }
      if (actualGlobalCloseEvents.escape) {
        window.removeEventListener('keydown', handleEsc)
      }
      if (addHoveringTooltipListeners) {
        tooltipElement?.removeEventListener('mouseover', handleMouseOverTooltip)
        tooltipElement?.removeEventListener('mouseout', handleMouseOutTooltip)
      }
      delegatedEvents.forEach(({ event, listener }) => {
        document.removeEventListener(event, listener)
      })

      internalDebouncedHandleShowTooltip.cancel()
      internalDebouncedHandleHideTooltip.cancel()
    }
  }, [
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
    hoveringTooltip,
  ])
}

export default useTooltipEvents
