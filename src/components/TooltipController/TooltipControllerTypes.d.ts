import type { CSSProperties } from 'react'

import type {
  PlacesType,
  VariantType,
  WrapperType,
  ChildrenType,
  EventsType,
  PositionStrategy,
} from 'components/Tooltip/TooltipTypes'

export interface ITooltipController {
  className?: string
  classNameArrow?: string
  content?: string
  html?: string
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  anchorId?: string
  wrapper?: WrapperType
  children?: ChildrenType
  events?: EventsType[]
  positionStrategy?: PositionStrategy
  delayShow?: number
  delayHide?: number
  noArrow?: boolean
  style?: CSSProperties
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-tooltip-place'?: PlacesType
    'data-tooltip-content'?: string
    'data-tooltip-html'?: string
    'data-tooltip-variant'?: VariantType
    'data-tooltip-offset'?: number
    'data-tooltip-wrapper'?: WrapperType
    'data-tooltip-events'?: EventsType[]
    'data-tooltip-position-strategy'?: PositionStrategy
    'data-tooltip-delay-show'?: number
    'data-tooltip-delay-hide'?: number
  }
}
