import type { ReactNode, RefObject } from 'react'
import type { ITooltipController } from 'components/TooltipController/TooltipControllerTypes'

export type AnchorRef = RefObject<HTMLElement>

export interface TooltipContextData {
  anchorRefs: Set<AnchorRef>
  activeAnchor: AnchorRef
  attach: (...refs: AnchorRef[]) => void
  detach: (...refs: AnchorRef[]) => void
  setActiveAnchor: (ref: AnchorRef) => void
}

export type TooltipContextDataWrapper = TooltipContextData & {
  // This means the context is a callable object
  (tooltipId?: string): TooltipContextData
}

export interface ITooltipWrapper {
  tooltipId?: string
  children: ReactNode

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
