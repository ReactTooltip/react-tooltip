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
  AnchorOpenEvents,
  AnchorCloseEvents,
  GlobalCloseEvents,
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
   * @deprecated Use `openOnClick` or `openEvents`/`closeEvents` instead.
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
   * @deprecated Use `globalCloseEvents={{ escape: true }}` instead.
   */
  closeOnEsc?: boolean
  /**
   * @deprecated Use `globalCloseEvents={{ scroll: true }}` instead.
   */
  closeOnScroll?: boolean
  /**
   * @deprecated Use `globalCloseEvents={{ resize: true }}` instead.
   */
  closeOnResize?: boolean
  /**
   * @description The events to be listened on anchor elements to open the tooltip.
   */
  openEvents?: AnchorOpenEvents
  /**
   * @description The events to be listened on anchor elements to close the tooltip.
   */
  closeEvents?: AnchorCloseEvents
  /**
   * @description The global events listened to close the tooltip.
   */
  globalCloseEvents?: GlobalCloseEvents
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
  arrowColor?: CSSProperties['backgroundColor']
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
