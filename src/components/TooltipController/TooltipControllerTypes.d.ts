import type {
  PlacesType,
  VariantType,
  WrapperType,
  ChildrenType,
  EventsType,
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
  delayShow?: number
  delayHide?: number
  getContent?: function
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
}
