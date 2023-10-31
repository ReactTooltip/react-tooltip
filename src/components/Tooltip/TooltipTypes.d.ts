import type { ElementType, ReactNode, CSSProperties, RefObject } from 'react'

export type PlacesType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export type VariantType = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

export type WrapperType = ElementType | 'div' | 'span'

export type ChildrenType = Element | ElementType | ReactNode

export type EventsType = 'hover' | 'click'

export type PositionStrategy = 'absolute' | 'fixed'

export type DataAttribute =
  | 'place'
  | 'content'
  | 'html'
  | 'variant'
  | 'offset'
  | 'wrapper'
  | 'events'
  | 'position-strategy'
  | 'delay-show'
  | 'delay-hide'
  | 'float'
  | 'hidden'

/**
 * @description floating-ui middleware
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = any

export interface IPosition {
  x: number
  y: number
}

export type AnchorOpenEvents = {
  mouseenter?: boolean
  focus?: boolean
  click?: boolean
  dblclick?: boolean
  mousedown?: boolean
}
export type AnchorCloseEvents = {
  mouseleave?: boolean
  blur?: boolean
  click?: boolean
  dblclick?: boolean
  mouseup?: boolean
}
export type GlobalCloseEvents = {
  escape?: boolean
  scroll?: boolean
  resize?: boolean
  clickOutsideAnchor?: boolean
}

export interface ITooltip {
  className?: string
  classNameArrow?: string
  content?: ChildrenType
  contentWrapperRef?: RefObject<HTMLDivElement>
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
  wrapper: WrapperType
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
  closeOnEsc?: boolean
  closeOnScroll?: boolean
  closeOnResize?: boolean
  openEvents?: AnchorOpenEvents
  closeEvents?: AnchorCloseEvents
  globalCloseEvents?: GlobalCloseEvents
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
  activeAnchor: HTMLElement | null
  setActiveAnchor: (anchor: HTMLElement | null) => void
  border?: CSSProperties['border']
  opacity?: CSSProperties['opacity']
  arrowColor?: CSSProperties['backgroundColor']
}
