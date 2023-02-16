import type { CSSProperties } from 'react'

import type {
  PlacesType,
  VariantType,
  WrapperType,
  ChildrenType,
  EventsType,
  PositionStrategy,
  IPosition,
  Middleware,
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
  /**
   * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
   * See https://react-tooltip.com/docs/getting-started
   */
  anchorId?: string
  anchorSelect?: string
  wrapper?: WrapperType
  children?: ChildrenType
  events?: EventsType[]
  positionStrategy?: PositionStrategy
  middlewares?: Middleware[]
  delayShow?: number
  delayHide?: number
  float?: boolean
  noArrow?: boolean
  clickable?: boolean
  closeOnEsc?: boolean
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-tooltip-id'?: string
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
    'data-tooltip-float'?: boolean
  }
}
