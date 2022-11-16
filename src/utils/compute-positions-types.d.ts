export interface IComputePositions {
  elementReference?: Element | HTMLElement | null
  tooltipReference?: Element | HTMLElement | null
  tooltipArrowReference?: Element | HTMLElement | null
  place?: 'top' | 'right' | 'bottom' | 'left'
  offset?: number
}
