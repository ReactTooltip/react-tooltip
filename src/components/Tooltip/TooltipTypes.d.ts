export type PlacesType = 'top' | 'right' | 'bottom' | 'left'

export type VariantType = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

export interface ITooltip {
  className?: string
  classNameArrow?: string
  content?: string | number
  html?: string
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  anchorId
  isHtmlContent?: boolean
}
