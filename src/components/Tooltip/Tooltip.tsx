import { createRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './styles.module.css'
import { computeToolTipPosition } from '../../utils/compute-positions'
import debounce from '../../utils/debounce'
import type { ITooltip } from './TooltipTypes'

const Tooltip = ({ id, content, anchorId }: ITooltip) => {
  const tooltipRef = createRef()
  const [inlineStyles, setInlineStyles] = useState({})
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

    computeToolTipPosition({ elementReference, tooltipReference: tooltipRef.current }).then(
      (computedStyles) => {
        if (Object.keys(computedStyles).length) {
          setInlineStyles(computedStyles)
        }
      },
    )
  }, [show, anchorId])

  return (
    <div
      id={id}
      role="tooltip"
      className={classNames(styles['tooltip'], {
        [styles['show']]: show,
      })}
      style={inlineStyles}
      ref={tooltipRef}
    >
      {content}
      {/* <div id="arrow" className={styles['arrow']} style={{ ...arrowStyles }} ref={arrowRef} /> */}
    </div>
  )
}

export default Tooltip
