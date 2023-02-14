import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import debounce from 'utils/debounce'
import { TooltipContent } from 'components/TooltipContent'
import { useTooltip } from 'components/TooltipProvider'
import { computeTooltipPosition } from '../../utils/compute-positions'
import styles from './styles.module.css'
import type { IPosition, ITooltip } from './TooltipTypes'

const Tooltip = ({
  // props
  id,
  className,
  classNameArrow,
  variant = 'dark',
  anchorId,
  anchorSelect,
  place = 'top',
  offset = 10,
  events = ['hover'],
  positionStrategy = 'absolute',
  middlewares,
  wrapper: WrapperElement,
  children = null,
  delayShow = 0,
  delayHide = 0,
  float = false,
  noArrow = false,
  clickable = false,
  closeOnEsc = false,
  style: externalStyles,
  position,
  afterShow,
  afterHide,
  // props handled by controller
  content,
  html,
  isOpen,
  setIsOpen,
  activeAnchor,
  setActiveAnchor,
}: ITooltip) => {
  const tooltipRef = useRef<HTMLElement>(null)
  const tooltipArrowRef = useRef<HTMLElement>(null)
  const tooltipShowDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipHideDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [inlineStyles, setInlineStyles] = useState({})
  const [inlineArrowStyles, setInlineArrowStyles] = useState({})
  const [show, setShow] = useState(false)
  const [rendered, setRendered] = useState(false)
  const wasShowing = useRef(false)
  const lastFloatPosition = useRef<IPosition | null>(null)
  /**
   * @todo Remove this in a future version (provider/wrapper method is deprecated)
   */
  const { anchorRefs, setActiveAnchor: setProviderActiveAnchor } = useTooltip(id)
  const hoveringTooltip = useRef(false)
  const [anchorsBySelect, setAnchorsBySelect] = useState<HTMLElement[]>([])

  useEffect(() => {
    let selector = anchorSelect
    if (!selector && id) {
      selector = `[data-tooltip-id='${id}']`
    }
    if (!selector) {
      return
    }
    try {
      const anchors = Array.from(document.querySelectorAll<HTMLElement>(selector))
      setAnchorsBySelect(anchors)
    } catch {
      // warning was already issued in the controller
      setAnchorsBySelect([])
    }
  }, [anchorSelect])

  useEffect(() => {
    if (!show) {
      /**
       * this fixes weird behavior when switching between two anchor elements very quickly
       * remove the timeout and switch quickly between two adjancent anchor elements to see it
       */
      const timeout = setTimeout(() => {
        setRendered(false)
      })
      return () => {
        clearTimeout(timeout)
      }
    }
    return () => null
  }, [show])

  const handleShow = (value: boolean) => {
    setRendered(true)
    /**
     * wait for the component to render and calculate position
     * before actually showing
     */
    setTimeout(() => {
      setIsOpen?.(value)
      if (isOpen === undefined) {
        setShow(value)
      }
    }, 10)
  }

  /**
   * this replicates the effect from `handleShow()`
   * when `isOpen` is changed from outside
   */
  useEffect(() => {
    if (isOpen === undefined) {
      return () => null
    }
    if (isOpen) {
      setRendered(true)
    }
    const timeout = setTimeout(() => {
      setShow(isOpen)
    }, 10)
    return () => {
      clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (show === wasShowing.current) {
      return
    }
    wasShowing.current = show
    if (show) {
      afterShow?.()
    } else {
      afterHide?.()
    }
  }, [show])

  const handleShowTooltipDelayed = () => {
    if (tooltipShowDelayTimerRef.current) {
      clearTimeout(tooltipShowDelayTimerRef.current)
    }

    tooltipShowDelayTimerRef.current = setTimeout(() => {
      handleShow(true)
    }, delayShow)
  }

  const handleHideTooltipDelayed = (delay = delayHide) => {
    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }

    tooltipHideDelayTimerRef.current = setTimeout(() => {
      if (hoveringTooltip.current) {
        return
      }
      handleShow(false)
    }, delay)
  }

  const handleShowTooltip = (event?: Event) => {
    if (!event) {
      return
    }
    if (delayShow) {
      handleShowTooltipDelayed()
    } else {
      handleShow(true)
    }
    const target = event.currentTarget ?? event.target
    setActiveAnchor(target as HTMLElement)
    setProviderActiveAnchor({ current: target as HTMLElement })

    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }
  }

  const handleHideTooltip = () => {
    if (clickable) {
      // allow time for the mouse to reach the tooltip, in case there's a gap
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

  const handleTooltipPosition = ({ x, y }: IPosition) => {
    const virtualElement = {
      getBoundingClientRect() {
        return {
          x,
          y,
          width: 0,
          height: 0,
          top: y,
          left: x,
          right: x,
          bottom: y,
        }
      },
    } as Element
    computeTooltipPosition({
      place,
      offset,
      elementReference: virtualElement,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
      middlewares,
    }).then((computedStylesData) => {
      if (Object.keys(computedStylesData.tooltipStyles).length) {
        setInlineStyles(computedStylesData.tooltipStyles)
      }
      if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
        setInlineArrowStyles(computedStylesData.tooltipArrowStyles)
      }
    })
  }

  const handleMouseMove = (event?: Event) => {
    if (!event) {
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

  const handleClickTooltipAnchor = (event?: Event) => {
    handleShowTooltip(event)
    if (delayHide) {
      handleHideTooltipDelayed()
    }
  }

  const handleClickOutsideAnchors = (event: MouseEvent) => {
    const anchorById = document.querySelector<HTMLElement>(`[id='${anchorId}']`)
    if (anchorById?.contains(event.target as HTMLElement)) {
      return
    }

    if (anchorsBySelect.some((anchor) => anchor.contains(event.target as HTMLElement))) {
      return
    }

    handleShow(false)
  }

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return
    }
    handleShow(false)
  }

  // debounce handler to prevent call twice when
  // mouse enter and focus events being triggered toggether
  const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50)
  const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50)

  useEffect(() => {
    const elementRefs = new Set(anchorRefs)

    anchorsBySelect.forEach((anchor) => {
      elementRefs.add({ current: anchor })
    })

    const anchorById = document.querySelector<HTMLElement>(`[id='${anchorId}']`)
    if (anchorById) {
      elementRefs.add({ current: anchorById })
    }

    if (!elementRefs.size) {
      return () => null
    }

    if (closeOnEsc) {
      window.addEventListener('keydown', handleEsc)
    }

    const enabledEvents: { event: string; listener: (event?: Event) => void }[] = []

    if (events.find((event: string) => event === 'click')) {
      window.addEventListener('click', handleClickOutsideAnchors)
      enabledEvents.push({ event: 'click', listener: handleClickTooltipAnchor })
    }

    if (events.find((event: string) => event === 'hover')) {
      enabledEvents.push(
        { event: 'mouseenter', listener: debouncedHandleShowTooltip },
        { event: 'mouseleave', listener: debouncedHandleHideTooltip },
        { event: 'focus', listener: debouncedHandleShowTooltip },
        { event: 'blur', listener: debouncedHandleHideTooltip },
      )
      if (float) {
        enabledEvents.push({
          event: 'mousemove',
          listener: handleMouseMove,
        })
      }
    }

    const handleMouseEnterTooltip = () => {
      hoveringTooltip.current = true
    }
    const handleMouseLeaveTooltip = () => {
      hoveringTooltip.current = false
      handleHideTooltip()
    }

    if (clickable) {
      tooltipRef.current?.addEventListener('mouseenter', handleMouseEnterTooltip)
      tooltipRef.current?.addEventListener('mouseleave', handleMouseLeaveTooltip)
    }

    enabledEvents.forEach(({ event, listener }) => {
      elementRefs.forEach((ref) => {
        ref.current?.addEventListener(event, listener)
      })
    })

    const parentObserverCallback: MutationCallback = (mutationList) => {
      if (!activeAnchor) {
        return
      }
      mutationList.some((mutation) => {
        if (mutation.type !== 'childList') {
          return false
        }
        return [...mutation.removedNodes].some((node) => {
          if (node.contains(activeAnchor)) {
            handleShow(false)
            return true
          }
          return false
        })
      })
    }

    const parentObserver = new MutationObserver(parentObserverCallback)

    // watch for anchor being removed from the DOM
    parentObserver.observe(document.body, { attributes: false, childList: true, subtree: true })

    return () => {
      if (events.find((event: string) => event === 'click')) {
        window.removeEventListener('click', handleClickOutsideAnchors)
      }
      if (closeOnEsc) {
        window.removeEventListener('keydown', handleEsc)
      }
      if (clickable) {
        tooltipRef.current?.removeEventListener('mouseenter', handleMouseEnterTooltip)
        tooltipRef.current?.removeEventListener('mouseleave', handleMouseLeaveTooltip)
      }
      enabledEvents.forEach(({ event, listener }) => {
        elementRefs.forEach((ref) => {
          ref.current?.removeEventListener(event, listener)
        })
      })
      parentObserver.disconnect()
    }
    /**
     * rendered is also a dependency to ensure anchor observers are re-registered
     * since `tooltipRef` becomes stale after removing/adding the tooltip to the DOM
     */
  }, [
    rendered,
    anchorRefs,
    activeAnchor,
    closeOnEsc,
    anchorId,
    anchorsBySelect,
    events,
    delayHide,
    delayShow,
  ])

  useEffect(() => {
    if (position) {
      // if `position` is set, override regular and `float` positioning
      handleTooltipPosition(position)
      return () => null
    }

    if (float) {
      if (lastFloatPosition.current) {
        /*
          Without this, changes to `content`, `place`, `offset`, ..., will only
          trigger a position calculation after a `mousemove` event.

          To see why this matters, comment this line, run `yarn dev` and click the
          "Hover me!" anchor.
        */
        handleTooltipPosition(lastFloatPosition.current)
      }
      // if `float` is set, override regular positioning
      return () => null
    }

    let mounted = true
    computeTooltipPosition({
      place,
      offset,
      elementReference: activeAnchor,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
      middlewares,
    }).then((computedStylesData) => {
      if (!mounted) {
        // invalidate computed positions after remount
        return
      }
      if (Object.keys(computedStylesData.tooltipStyles).length) {
        setInlineStyles(computedStylesData.tooltipStyles)
      }
      if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
        setInlineArrowStyles(computedStylesData.tooltipArrowStyles)
      }
    })
    return () => {
      mounted = false
    }
  }, [
    show,
    anchorId,
    anchorsBySelect,
    activeAnchor,
    content,
    html,
    place,
    offset,
    positionStrategy,
    position,
  ])

  useEffect(() => {
    const anchorById = document.querySelector<HTMLElement>(`[id='${anchorId}']`)
    const anchors = [...anchorsBySelect, anchorById]
    if (!activeAnchor || !anchors.includes(activeAnchor)) {
      /**
       * if there is no active anchor,
       * or if the current active anchor is not amongst the allowed ones,
       * reset it
       */
      setActiveAnchor(anchorsBySelect[0] ?? anchorById)
    }
  }, [anchorId, anchorsBySelect, activeAnchor])

  useEffect(() => {
    return () => {
      if (tooltipShowDelayTimerRef.current) {
        clearTimeout(tooltipShowDelayTimerRef.current)
      }
      if (tooltipHideDelayTimerRef.current) {
        clearTimeout(tooltipHideDelayTimerRef.current)
      }
    }
  }, [])

  const hasContentOrChildren = Boolean(html || content || children)
  const canShow = hasContentOrChildren && show && Object.keys(inlineStyles).length > 0

  return rendered ? (
    <WrapperElement
      id={id}
      role="tooltip"
      className={classNames('react-tooltip', styles['tooltip'], styles[variant], className, {
        [styles['show']]: canShow,
        [styles['fixed']]: positionStrategy === 'fixed',
        [styles['clickable']]: clickable,
      })}
      style={{ ...externalStyles, ...inlineStyles }}
      ref={tooltipRef}
    >
      {/**
       * content priority: html > content > children
       * children should be last so that it can be used as the "default" content
       */}
      {(html && <TooltipContent content={html} />) || content || children}
      <WrapperElement
        className={classNames('react-tooltip-arrow', styles['arrow'], classNameArrow, {
          [styles['no-arrow']]: noArrow,
        })}
        style={inlineArrowStyles}
        ref={tooltipArrowRef}
      />
    </WrapperElement>
  ) : null
}

export default Tooltip
