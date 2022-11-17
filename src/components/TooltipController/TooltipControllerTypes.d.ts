export interface ITooltipController {
  className?: string
  classNameArrow?: string
  content?: string | number
  html?: string
  place?: 'top' | 'right' | 'bottom' | 'left'
  offset?: number
  id?: string
  variant?: 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'
  anchorId
}
