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
  place = 'top',
  offset = 10,
  events = ['hover'],
  positionStrategy = 'absolute',
  wrapper: WrapperElement = 'div',
  children = null,
  delayShow = 0,
  delayHide = 0,
  float = false,
  noArrow = false,
  clickable = false,
  style: externalStyles,
  position,
  // props handled by controller
  isHtmlContent = false,
  content,
  isOpen,
  setIsOpen,
}: ITooltip) => {
  const tooltipRef = useRef<HTMLElement>(null)
  const tooltipArrowRef = useRef<HTMLDivElement>(null)
  const tooltipShowDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipHideDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [inlineStyles, setInlineStyles] = useState({})
  const [inlineArrowStyles, setInlineArrowStyles] = useState({})
  const [show, setShow] = useState<boolean>(false)
  const [calculatingPosition, setCalculatingPosition] = useState(false)
  const lastFloatPosition = useRef<IPosition | null>(null)
  const { anchorRefs, setActiveAnchor: setProviderActiveAnchor } = useTooltip()(id)
  const [activeAnchor, setActiveAnchor] = useState<React.RefObject<HTMLElement>>({ current: null })
  const hoveringTooltip = useRef(false)

  const handleShow = (value: boolean) => {
    if (setIsOpen) {
      setIsOpen(value)
    } else if (isOpen === undefined) {
      setShow(value)
    }
  }

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
    setActiveAnchor((anchor) =>
      anchor.current === target ? anchor : { current: target as HTMLElement },
    )
    setProviderActiveAnchor({ current: target as HTMLElement })

    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }
  }

  const handleHideTooltip = () => {
    if (clickable) {
      // allow time for the mouse to reach the tooltip, in case there's a gap
      handleHideTooltipDelayed(delayHide || 50)
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
    setCalculatingPosition(true)
    computeTooltipPosition({
      place,
      offset,
      elementReference: virtualElement,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
    }).then((computedStylesData) => {
      setCalculatingPosition(false)
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

  const handleClickOutsideAnchor = (event: MouseEvent) => {
    if (activeAnchor.current?.contains(event.target as HTMLElement)) {
      return
    }
    setShow(false)
  }

  // debounce handler to prevent call twice when
  // mouse enter and focus events being triggered toggether
  const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50)
  const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50)

  useEffect(() => {
    const elementRefs = new Set(anchorRefs)

    const anchorById = document.querySelector(`[id='${anchorId}']`) as HTMLElement
    if (anchorById) {
      setActiveAnchor((anchor) =>
        anchor.current === anchorById ? anchor : { current: anchorById },
      )
      elementRefs.add({ current: anchorById })
    }

    if (!elementRefs.size) {
      return () => null
    }

    const enabledEvents: { event: string; listener: (event?: Event) => void }[] = []

    if (events.find((event: string) => event === 'click')) {
      window.addEventListener('click', handleClickOutsideAnchor)
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

    return () => {
      window.removeEventListener('click', handleClickOutsideAnchor)
      if (clickable) {
        tooltipRef.current?.removeEventListener('mouseenter', handleMouseEnterTooltip)
        tooltipRef.current?.removeEventListener('mouseleave', handleMouseLeaveTooltip)
      }
      enabledEvents.forEach(({ event, listener }) => {
        elementRefs.forEach((ref) => {
          ref.current?.removeEventListener(event, listener)
        })
      })
    }
  }, [anchorRefs, activeAnchor, anchorId, events, delayHide, delayShow])

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

    let elementReference = activeAnchor.current
    if (anchorId) {
      // `anchorId` element takes precedence
      elementReference = document.querySelector(`[id='${anchorId}']`) as HTMLElement
    }
    setCalculatingPosition(true)
    let mounted = true
    computeTooltipPosition({
      place,
      offset,
      elementReference,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
    }).then((computedStylesData) => {
      if (!mounted) {
        // invalidate computed positions after remount
        return
      }
      setCalculatingPosition(false)
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
  }, [show, isOpen, anchorId, activeAnchor, content, place, offset, positionStrategy, position])

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

  const hasContentOrChildren = Boolean(content || children)

  return (
    <WrapperElement
      id={id}
      role="tooltip"
      className={classNames('react-tooltip', styles['tooltip'], styles[variant], className, {
        [styles['show']]: hasContentOrChildren && !calculatingPosition && (isOpen || show),
        [styles['fixed']]: positionStrategy === 'fixed',
        [styles['clickable']]: clickable,
      })}
      style={{ ...externalStyles, ...inlineStyles }}
      ref={tooltipRef}
    >
      {children || (isHtmlContent ? <TooltipContent content={content as string} /> : content)}
      <div
        className={classNames('react-tooltip-arrow', styles['arrow'], classNameArrow, {
          [styles['no-arrow']]: noArrow,
        })}
        style={inlineArrowStyles}
        ref={tooltipArrowRef}
      />
    </WrapperElement>
  )
}

export default Tooltip
