import { createRef, useEffect, useState, useId, useRef } from 'react'
import classNames from 'classnames'
import debounce from 'utils/debounce'
import { TooltipContent } from 'components/TooltipContent'
import { useTooltip } from 'components/TooltipProvider'
import { computeToolTipPosition } from '../../utils/compute-positions'
import styles from './styles.module.css'
import type { ITooltip } from './TooltipTypes'

const Tooltip = ({
  // props
  id = useId(),
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
  style: externalStyles,
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
  const { anchorRefs, setActiveAnchor: setProviderActiveAnchor } = useTooltip()
  const [activeAnchor, setActiveAnchor] = useState<React.RefObject<HTMLElement>>({ current: null })

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

  const handleHideTooltipDelayed = () => {
    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }

    tooltipHideDelayTimerRef.current = setTimeout(() => {
      handleShow(false)
    }, delayHide)
  }

  const handleShowTooltip = (e?: Event) => {
    if (!e) {
      return
    }
    if (delayShow) {
      handleShowTooltipDelayed()
    } else {
      handleShow(true)
    }
    setActiveAnchor({ current: e.target as HTMLElement })
    setProviderActiveAnchor({ current: e.target as HTMLElement })

    if (tooltipHideDelayTimerRef.current) {
      clearTimeout(tooltipHideDelayTimerRef.current)
    }
  }

  const handleHideTooltip = () => {
    if (delayHide) {
      handleHideTooltipDelayed()
    } else {
      handleShow(false)
    }
    setActiveAnchor({ current: null })

    if (tooltipShowDelayTimerRef.current) {
      clearTimeout(tooltipShowDelayTimerRef.current)
    }
  }

  const handleClickTooltipAnchor = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen)
    } else if (isOpen === undefined) {
      setShow((currentValue) => !currentValue)
    }
  }

  // debounce handler to prevent call twice when
  // mouse enter and focus events being triggered toggether
  const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50)
  const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50)

  useEffect(() => {
    const elementRefs = new Set(anchorRefs)

    const anchorById = document.querySelector(`[id='${anchorId}']`)
    if (anchorById) {
      setActiveAnchor({ current: anchorById as HTMLElement })
      elementRefs.add({ current: anchorById as HTMLElement })
    }

    if (!elementRefs.size) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    const enabledEvents: { event: string; listener: (e?: Event) => void }[] = []

    if (events.find((event: string) => event === 'click')) {
      enabledEvents.push({ event: 'click', listener: handleClickTooltipAnchor })
    }

    if (events.find((event: string) => event === 'hover')) {
      enabledEvents.push(
        { event: 'mouseenter', listener: debouncedHandleShowTooltip },
        { event: 'mouseleave', listener: debouncedHandleHideTooltip },
        { event: 'focus', listener: debouncedHandleShowTooltip },
        { event: 'blur', listener: debouncedHandleHideTooltip },
      )
    }

    enabledEvents.forEach(({ event, listener }) => {
      elementRefs.forEach((ref) => {
        ref.current?.addEventListener(event, listener)
      })
    })

    return () => {
      enabledEvents.forEach(({ event, listener }) => {
        elementRefs.forEach((ref) => {
          ref.current?.removeEventListener(event, listener)
        })
      })
    }
  }, [anchorRefs, anchorId, events, delayHide, delayShow])

  useEffect(() => {
    const elementReference = activeAnchor.current

    computeToolTipPosition({
      place,
      offset,
      elementReference,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
    }).then((computedStylesData) => {
      if (Object.keys(computedStylesData.tooltipStyles).length) {
        setInlineStyles(computedStylesData.tooltipStyles)
      }

      if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
        setInlineArrowStyles(computedStylesData.tooltipArrowStyles)
      }
    })
  }, [show, isOpen, activeAnchor])

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

  return (
    <WrapperElement
      id={id}
      role="tooltip"
      className={classNames(styles['tooltip'], styles[variant], className, {
        [styles['show']]: isOpen || show,
        [styles['fixed']]: positionStrategy === 'fixed',
      })}
      style={{ ...externalStyles, ...inlineStyles }}
      ref={tooltipRef}
    >
      {children || (isHtmlContent ? <TooltipContent content={content as string} /> : content)}
      <div
        className={classNames(styles['arrow'], classNameArrow)}
        style={inlineArrowStyles}
        ref={tooltipArrowRef}
      />
    </WrapperElement>
  )
}

export default Tooltip
