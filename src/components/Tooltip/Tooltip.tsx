import { createRef, useEffect, useState, useId } from 'react'
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
  // events = 'hover',
  wrapper: WrapperElement = 'div',
  children = null,

  // props handled by controller
  isHtmlContent = false,
  content,
}: ITooltip) => {
  const tooltipRef = createRef()
  const tooltipArrowRef = createRef()
  const [inlineStyles, setInlineStyles] = useState({})
  const [inlineArrowStyles, setInlineArrowStyles] = useState({})
  const [show, setShow] = useState<boolean>(false)

  const handleShowTooltip = () => {
    setShow(true)
  }

  const handleHideTooltip = () => {
    setShow(false)
  }

  const handleClickTooltip = () => {
    setShow((currentValue) => !currentValue)
  }

  // debounce handler to prevent call twice when
  // mouse enter and focus events being triggered toggether
  const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50)
  const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50)

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    console.log(anchorId, content)

    if (!elementReference) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    const events = [
      { event: 'click', listener: handleClickTooltip },
      { event: 'mouseenter', listener: debouncedHandleShowTooltip },
      { event: 'mouseleave', listener: debouncedHandleHideTooltip },
      { event: 'focus', listener: debouncedHandleShowTooltip },
      { event: 'blur', listener: debouncedHandleHideTooltip },
    ]

    events.forEach(({ event, listener }) => {
      elementReference?.addEventListener(event, listener)
    })

    return () => {
      events.forEach(({ event, listener }) => {
        elementReference?.removeEventListener(event, listener)
      })
    }
  }, [anchorId])

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    computeToolTipPosition({
      place,
      offset,
      elementReference,
      tooltipReference: tooltipRef.current as HTMLElement,
      tooltipArrowReference: tooltipArrowRef.current as HTMLElement,
    }).then((computedStylesData) => {
      if (Object.keys(computedStylesData.tooltipStyles).length) {
        setInlineStyles(computedStylesData.tooltipStyles)
      }

      if (Object.keys(computedStylesData.tooltipArrowStyles).length) {
        setInlineArrowStyles(computedStylesData.tooltipArrowStyles)
      }
    })
  }, [show, anchorId])

  return (
    <WrapperElement
      id={id}
      role="tooltip"
      className={classNames(styles['tooltip'], styles[variant], className, {
        [styles['show']]: show,
      })}
      style={inlineStyles}
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
