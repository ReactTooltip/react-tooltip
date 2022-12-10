import React, { useEffect, useRef } from 'react'
import { useTooltip } from './TooltipProvider'
import type { ITooltipWrapper } from './TooltipProviderTypes'

const TooltipWrapper = ({
  tooltipId,
  forwardRef,
  children,
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
  const { attach, detach } = useTooltip()(tooltipId)
  const anchorRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    attach(anchorRef)
    return () => {
      detach(anchorRef)
    }
  }, [])

  return React.cloneElement(children, {
    ref: (ref: HTMLElement) => {
      anchorRef.current = ref
      if (forwardRef) {
        // eslint-disable-next-line no-param-reassign
        forwardRef.current = ref
      }
    },
    'data-tooltip-place': place,
    'data-tooltip-content': content,
    'data-tooltip-html': html,
    'data-tooltip-variant': variant,
    'data-tooltip-offset': offset,
    'data-tooltip-wrapper': wrapper,
    'data-tooltip-events': events,
    'data-tooltip-position-strategy': positionStrategy,
    'data-tooltip-delay-show': delayShow,
    'data-tooltip-delay-hide': delayHide,
  })
}

export default TooltipWrapper
