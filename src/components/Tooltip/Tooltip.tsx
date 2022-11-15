import { createRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './styles.module.css'
import { computeToolTipPosition } from '../../utils/compute-positions'
import debounce from '../../utils/debounce'
import type { ITooltip } from './TooltipTypes'

const Tooltip = ({ id, content, anchorId }: ITooltip) => {
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
      ['mouseenter', debouncedHandleShowTooltip],
      ['mouseleave', debouncedHandleHideTooltip],
      ['focus', debouncedHandleShowTooltip],
      ['blur', debouncedHandleHideTooltip],
    ]

    console.log(anchorId)
    events.forEach(([event, listener]) => {
      elementReference?.addEventListener(event, listener)
    })

    return () => {
      events.forEach(([event, listener]) => {
        elementReference?.removeEventListener(event, listener)
      })
    }
  }, [anchorId])

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    computeToolTipPosition({
      elementReference,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
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
      className={classNames(styles['tooltip'], {
        [styles['show']]: show,
      })}
      style={inlineStyles}
      ref={tooltipRef as React.RefObject<HTMLDivElement>}
    >
      {content}
      <div
        id="arrow"
        className={styles['arrow']}
        style={{ ...inlineArrowStyles }}
        ref={tooltipArrowRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  )
}

export default Tooltip
