export interface ITooltip {
  className?: string
  classNameArrow?: string
  content?: string | number
  place?: 'top' | 'right' | 'bottom' | 'left'
  offset?: number
  id?: string
  variant?: 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'
}
