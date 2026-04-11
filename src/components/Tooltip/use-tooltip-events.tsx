import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import { autoUpdate } from '@floating-ui/dom'
import { debounce, getScrollParent, clearTimeoutRef } from 'utils'
import type {
  AnchorCloseEvents,
  AnchorOpenEvents,
  GlobalCloseEvents,
  IPosition,
} from './TooltipTypes'

const useTooltipEvents = ({
  activeAnchor,
  anchorElements,
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
    const handlePointerMove = (event?: Event) => {
      if (!event) {
        return
      }
      const mouseEvent = event as MouseEvent
      const mousePosition = {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      }
      handleTooltipPosition(mousePosition)
      // eslint-disable-next-line no-param-reassign
      lastFloatPosition.current = mousePosition
    }

    const handleClickOutsideAnchors = (event: MouseEvent) => {
      if (!show) {
        return
      }
      const target = event.target as HTMLElement
      if (!target.isConnected) {
        return
      }
      if (tooltipRef.current?.contains(target)) {
        return
      }
      if (anchorElements.some((anchor) => anchor?.contains(target))) {
        return
      }
      handleShow(false)
      clearTimeoutRef(tooltipShowDelayTimerRef)
    }

    const handleShowTooltip = (event?: Event) => {
      if (!event) {
        return
      }
      const target = (event.currentTarget ?? event.target) as HTMLElement | null
      if (!target?.isConnected) {
        setActiveAnchor(null)
        return
      }
      if (disableTooltip?.(target)) {
        return
      }
      if (delayShow) {
        handleShowTooltipDelayed()
      } else {
        handleShow(true)
      }
      setActiveAnchor(target)

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
    const debouncedHandleShowTooltip = (e?: Event) => {
      internalDebouncedHandleHideTooltip.cancel()
      internalDebouncedHandleShowTooltip(e)
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

    const enabledEvents: { event: string; listener: (event?: Event) => void }[] = []

    const activeAnchorContainsTarget = (event?: Event): boolean =>
      Boolean(event?.target && activeAnchor?.contains(event.target as HTMLElement))
    const handleClickOpenTooltipAnchor = (event?: Event) => {
      if (show && activeAnchorContainsTarget(event)) {
        return
      }
      handleShowTooltip(event)
    }
    const handleClickCloseTooltipAnchor = (event?: Event) => {
      if (!show || !activeAnchorContainsTarget(event)) {
        return
      }
      handleHideTooltip()
    }

    const regularEvents = ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'focus', 'blur']
    const clickEvents = ['click', 'dblclick', 'mousedown', 'mouseup']

    Object.entries(actualOpenEvents).forEach(([event, enabled]) => {
      if (!enabled) {
        return
      }
      if (regularEvents.includes(event)) {
        enabledEvents.push({ event, listener: debouncedHandleShowTooltip })
      } else if (clickEvents.includes(event)) {
        enabledEvents.push({ event, listener: handleClickOpenTooltipAnchor })
      }
    })

    Object.entries(actualCloseEvents).forEach(([event, enabled]) => {
      if (!enabled) {
        return
      }
      if (regularEvents.includes(event)) {
        enabledEvents.push({ event, listener: debouncedHandleHideTooltip })
      } else if (clickEvents.includes(event)) {
        enabledEvents.push({ event, listener: handleClickCloseTooltipAnchor })
      }
    })

    if (float) {
      enabledEvents.push({
        event: 'pointermove',
        listener: handlePointerMove,
      })
    }

    const handleMouseOverTooltip = () => {
      // eslint-disable-next-line no-param-reassign
      hoveringTooltip.current = true
    }
    const handleMouseOutTooltip = () => {
      // eslint-disable-next-line no-param-reassign
      hoveringTooltip.current = false
      handleHideTooltip()
    }

    const addHoveringTooltipListeners =
      clickable && (actualCloseEvents.mouseout || actualCloseEvents.mouseleave)
    if (addHoveringTooltipListeners) {
      tooltipElement?.addEventListener('mouseover', handleMouseOverTooltip)
      tooltipElement?.addEventListener('mouseout', handleMouseOutTooltip)
    }

    enabledEvents.forEach(({ event, listener }) => {
      anchorElements.forEach((anchor) => {
        anchor.addEventListener(event, listener)
      })
    })

    return () => {
      clearTimeoutRef(tooltipShowDelayTimerRef)
      clearTimeoutRef(tooltipHideDelayTimerRef)

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
      enabledEvents.forEach(({ event, listener }) => {
        anchorElements.forEach((anchor) => {
          if (anchor && anchor.isConnected) {
            anchor.removeEventListener(event, listener)
          }
        })
      })

      internalDebouncedHandleShowTooltip.cancel()
      internalDebouncedHandleHideTooltip.cancel()
    }
  }, [
    activeAnchor,
    anchorElements,
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
