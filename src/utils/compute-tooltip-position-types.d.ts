import { CSSProperties } from 'react'
import type { Middleware, PlacesType } from '../components/Tooltip/TooltipTypes'

export interface IComputePositionArgs {
  elementReference?: Element | HTMLElement | null
  tooltipReference?: Element | HTMLElement | null
  tooltipArrowReference?: Element | HTMLElement | null
  place?: PlacesType
  offset?: number
  strategy?: 'absolute' | 'fixed'
  middlewares?: Middleware[]
  border?: CSSProperties['border']
}

export interface IComputedPosition {
  tooltipStyles: {
    left?: string
    top?: string
    border?: CSSProperties['border']
  }
  tooltipArrowStyles: {
    left?: string
    top?: string
    right?: string
    bottom?: string
    borderRight?: CSSProperties['border']
    borderBottom?: CSSProperties['border']
  }
  place: PlacesType
}
