import { createRef, useEffect, useState, useId, useRef } from 'react'
import classNames from 'classnames'
import debounce from 'utils/debounce'
import { TooltipContent } from 'components/TooltipContent'
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
  styles: externalStyles,
  // props handled by controller
  isHtmlContent = false,
  content,
  isOpen,
  setIsOpen,
}: ITooltip) => {
  const tooltipRef = createRef()
  const tooltipArrowRef = createRef()
  const tooltipShowDelayTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const tooltipHideDelayTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [inlineStyles, setInlineStyles] = useState({})
  const [inlineArrowStyles, setInlineArrowStyles] = useState({})
  const [show, setShow] = useState<boolean>(false)

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

  const handleShowTooltip = () => {
    if (delayShow) {
      handleShowTooltipDelayed()
    } else {
      handleShow(true)
    }

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

    if (show && tooltipShowDelayTimerRef.current) {
      clearTimeout(tooltipShowDelayTimerRef.current)
    } else if (!show && tooltipShowDelayTimerRef.current) {
      // workaround to prevent tooltip being show forever
      // when we remove the mouse before show tooltip with `delayShow`
      tooltipHideDelayTimerRef.current = setTimeout(() => {
        handleShow(false)
      }, delayShow * 2)
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
    const elementReference = document.querySelector(`#${anchorId}`)

    if (!elementReference) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    const enabledEvents: { event: string; listener: () => void }[] = []

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
      elementReference?.addEventListener(event, listener)
    })

    return () => {
      enabledEvents.forEach(({ event, listener }) => {
        elementReference?.removeEventListener(event, listener)
      })
    }
  }, [anchorId, events, delayHide, delayShow])

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    computeToolTipPosition({
      place,
      offset,
      elementReference,
      tooltipReference: tooltipRef.current as HTMLElement,
      tooltipArrowReference: tooltipArrowRef.current as HTMLElement,
      strategy: positionStrategy,
    }).then((computedStylesData) => {
      if (Object.keys(computedStylesData.tooltipStyles).length) {
        setInlineStyles(computedStylesData.tooltipStyles)
      }

      if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
        setInlineArrowStyles(computedStylesData.tooltipArrowStyles)
      }
    })

    return () => {
      tooltipShowDelayTimerRef.current = undefined
      tooltipHideDelayTimerRef.current = undefined
    }
  }, [show, isOpen, anchorId])

  return (
    <WrapperElement
      id={id}
      role="tooltip"
      className={classNames(styles['tooltip'], styles[variant], className, {
        [styles['show']]: isOpen || show,
        [styles['fixed']]: positionStrategy === 'fixed',
      })}
      style={{ ...externalStyles, ...inlineStyles }}
      ref={tooltipRef as React.RefObject<HTMLDivElement>}
    >
      {children || (isHtmlContent ? <TooltipContent content={content as string} /> : content)}
      <div
        className={classNames(styles['arrow'], classNameArrow)}
        style={inlineArrowStyles}
        ref={tooltipArrowRef as React.RefObject<HTMLDivElement>}
      />
    </WrapperElement>
  )
}

export default Tooltip
