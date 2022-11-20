import type {
  PlacesType,
  VariantType,
  WrapperType,
  ChildrenType,
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
  anchorId
  wrapper?: WrapperType
  children?: ChildrenType
}
