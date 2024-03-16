import type { ElementType, CSSProperties, RefObject, ReactNode } from 'react'

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

export type PositionStrategy = 'absolute' | 'fixed'

export type DataAttribute =
  | 'place'
  | 'content'
  | 'variant'
  | 'offset'
  | 'wrapper'
  | 'position-strategy'
  | 'delay-show'
  | 'delay-hide'
  | 'float'
  | 'hidden'
  | 'class-name'

/**
 * @description floating-ui middleware
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = any

export interface IPosition {
  x: number
  y: number
}

export interface TooltipImperativeOpenOptions {
  anchorSelect?: string
  position?: IPosition
  place?: PlacesType
  content?: ReactNode
  /**
   * @description Delay (in ms) before opening the tooltip.
   */
  delay?: number
}

export interface TooltipImperativeCloseOptions {
  /**
   * @description Delay (in ms) before closing the tooltip.
   */
  delay?: number
}

export interface TooltipRefProps {
  open: (options?: TooltipImperativeOpenOptions) => void
  close: (options?: TooltipImperativeCloseOptions) => void
  /**
   * @readonly
   */
  activeAnchor: HTMLElement | null
  /**
   * @readonly
   */
  place: PlacesType
  /**
   * @readonly
   */
  isOpen: boolean
}

export type AnchorOpenEvents = {
  mouseenter?: boolean
  focus?: boolean
  mouseover?: boolean
  click?: boolean
  dblclick?: boolean
  mousedown?: boolean
}
export type AnchorCloseEvents = {
  mouseleave?: boolean
  blur?: boolean
  mouseout?: boolean
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
  forwardRef?: React.ForwardedRef<TooltipRefProps>
  className?: string
  classNameArrow?: string
  content?: ReactNode
  contentWrapperRef?: RefObject<HTMLDivElement>
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  anchorSelect?: string
  wrapper: WrapperType
  openOnClick?: boolean
  positionStrategy?: PositionStrategy
  middlewares?: Middleware[]
  delayShow?: number
  delayHide?: number
  float?: boolean
  hidden?: boolean
  noArrow?: boolean
  clickable?: boolean
  openEvents?: AnchorOpenEvents
  closeEvents?: AnchorCloseEvents
  globalCloseEvents?: GlobalCloseEvents
  imperativeModeOnly?: boolean
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  defaultIsOpen?: boolean
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
  activeAnchor: HTMLElement | null
  setActiveAnchor: (anchor: HTMLElement | null) => void
  border?: CSSProperties['border']
  opacity?: CSSProperties['opacity']
  arrowColor?: CSSProperties['backgroundColor']
  role?: React.AriaRole
}
