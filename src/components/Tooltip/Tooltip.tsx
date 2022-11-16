import { createRef, useEffect, useState, useId } from 'react'
import classNames from 'classnames'
import debounce from 'utils/debounce'
import styles from './styles.module.css'
import { computeToolTipPosition } from '../../utils/compute-positions'
import type { ITooltip } from './TooltipTypes'

const Tooltip = ({
  id = useId(),
  className,
  classNameArrow,
  content,
  variant = 'dark',
  anchorId,
  place,
  offset,
}: ITooltip) => {
  const tooltipRef = createRef()
  const tooltipArrowRef = createRef()
  const [inlineStyles, setInlineStyles] = useState({})
  const [inlineArrowStyles, setInlineArrowStyles] = useState({})
  const [show, setShow] = useState(false)

  const handleShowTooltip = () => {
    setShow(true)
  }

  const handleHideTooltip = () => {
    setShow(false)
  }

  const debouncedHandleShowTooltip = debounce(handleShowTooltip, 50)
  const debouncedHandleHideTooltip = debounce(handleHideTooltip, 50)

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    const events = [
      { event: 'mouseenter', listener: debouncedHandleShowTooltip },
      { event: 'mouseleave', listener: debouncedHandleHideTooltip },
      { event: 'focus', listener: debouncedHandleShowTooltip },
      { event: 'blur', listener: debouncedHandleHideTooltip },
    ]

    console.log(anchorId)
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
    <div
      id={id}
      role="tooltip"
      className={classNames(styles['tooltip'], styles[variant], className, {
        [styles['show']]: show,
      })}
      style={inlineStyles}
      ref={tooltipRef as React.RefObject<HTMLDivElement>}
    >
      {content}
      <div
        className={classNames(styles['arrow'], classNameArrow)}
        style={inlineArrowStyles}
        ref={tooltipArrowRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  )
}

export default Tooltip
