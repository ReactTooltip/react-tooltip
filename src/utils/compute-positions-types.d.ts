import { CSSProperties } from 'react'
import type { Middleware } from '../components/Tooltip/TooltipTypes'

export interface IComputePositions {
  elementReference?: Element | HTMLElement | null
  tooltipReference?: Element | HTMLElement | null
  tooltipArrowReference?: Element | HTMLElement | null
  place?:
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
  offset?: number
  strategy?: 'absolute' | 'fixed'
  middlewares?: Middleware[]
  border?: CSSProperties['border']
}
