import type { ReactNode, RefObject } from 'react'
import type { ITooltipController } from 'components/TooltipController/TooltipControllerTypes'

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
export type AnchorRef = RefObject<HTMLElement>

export interface TooltipContextData {
  anchorRefs: Set<AnchorRef>
  activeAnchor: AnchorRef
  attach: (...refs: AnchorRef[]) => void
  detach: (...refs: AnchorRef[]) => void
  setActiveAnchor: (ref: AnchorRef) => void
}

export interface TooltipContextDataWrapper {
  getTooltipData: (tooltipId?: string) => TooltipContextData
}

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
export interface ITooltipWrapper {
  tooltipId?: string
  children: ReactNode
  className?: string

  place?: ITooltipController['place']
  content?: ITooltipController['content']
  html?: ITooltipController['html']
  variant?: ITooltipController['variant']
  offset?: ITooltipController['offset']
  wrapper?: ITooltipController['wrapper']
  events?: ITooltipController['events']
  positionStrategy?: ITooltipController['positionStrategy']
  delayShow?: ITooltipController['delayShow']
  delayHide?: ITooltipController['delayHide']
}
