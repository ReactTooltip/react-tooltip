import type { ElementType, ReactNode, Element, CSSProperties } from 'react'

export type PlacesType = 'top' | 'right' | 'bottom' | 'left'

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

export interface ITooltip {
  className?: string
  classNameArrow?: string
  content?: string
  html?: string
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  anchorId?: string
  isHtmlContent?: boolean
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
