import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useTooltip } from './TooltipProvider'
import type { ITooltipWrapper } from './TooltipProviderTypes'

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
const TooltipWrapper = ({
  tooltipId,
  children,
  className,
  place,
  content,
  html,
  variant,
  offset,
  wrapper,
  events,
  positionStrategy,
  delayShow,
  delayHide,
}: ITooltipWrapper) => {
  const { attach, detach } = useTooltip(tooltipId)
  const anchorRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    attach(anchorRef)
    return () => {
      detach(anchorRef)
    }
  }, [])

  return (
    <span
      ref={anchorRef}
      className={classNames('react-tooltip-wrapper', className)}
      data-tooltip-place={place}
      data-tooltip-content={content}
      data-tooltip-html={html}
      data-tooltip-variant={variant}
      data-tooltip-offset={offset}
      data-tooltip-wrapper={wrapper}
      data-tooltip-events={events}
      data-tooltip-position-strategy={positionStrategy}
      data-tooltip-delay-show={delayShow}
      data-tooltip-delay-hide={delayHide}
    >
      {children}
    </span>
  )
}

export default TooltipWrapper
