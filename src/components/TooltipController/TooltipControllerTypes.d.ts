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
  content?: string | number
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
  getContent?: (value) => string
  styles?: CSSProperties
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
}
