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
  /**
   * @deprecated Use `children` or `render` instead
   */
  html?: string
  render?: (render: { content: string | null; activeAnchor: HTMLElement | null }) => ChildrenType
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
  /**
   * @deprecated Use `openOnClick` instead.
   */
  events?: EventsType[]
  openOnClick?: boolean
  positionStrategy?: PositionStrategy
  middlewares?: Middleware[]
  delayShow?: number
  delayHide?: number
  float?: boolean
  hidden?: boolean
  noArrow?: boolean
  clickable?: boolean
  /**
   * @todo refactor to `hideOnEsc` for naming consistency
   */
  closeOnEsc?: boolean
  /**
   * @todo refactor to `hideOnScroll` for naming consistency
   */
  closeOnScroll?: boolean
  /**
   * @todo refactor to `hideOnResize` for naming consistency
   */
  closeOnResize?: boolean
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  disableStyleInjection?: boolean | 'core'
  /**
   * @description see https://developer.mozilla.org/en-US/docs/Web/CSS/border.
   *
   * Adding a border with width > 3px, or with `em/cm/rem/...` instead of `px`
   * might break the tooltip arrow positioning.
   */
  border?: CSSProperties['border']
  opacity?: CSSProperties['opacity']
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-tooltip-id'?: string
    'data-tooltip-place'?: PlacesType
    'data-tooltip-content'?: string | null
    'data-tooltip-html'?: string | null
    'data-tooltip-variant'?: VariantType
    'data-tooltip-offset'?: number
    'data-tooltip-wrapper'?: WrapperType
    /**
     * @deprecated Use `openOnClick` tooltip prop instead.
     */
    'data-tooltip-events'?: EventsType[]
    'data-tooltip-position-strategy'?: PositionStrategy
    'data-tooltip-delay-show'?: number
    'data-tooltip-delay-hide'?: number
    'data-tooltip-float'?: boolean
    'data-tooltip-hidden'?: boolean
  }
}
