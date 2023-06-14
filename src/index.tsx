import './tokens.css'

import styleInject from 'utils/style-inject'

import type {
  ChildrenType,
  DataAttribute,
  EventsType,
  PlacesType,
  PositionStrategy,
  VariantType,
  WrapperType,
  IPosition,
  Middleware,
} from './components/Tooltip/TooltipTypes'
import type { ITooltipController } from './components/TooltipController/TooltipControllerTypes'
import type { ITooltipWrapper } from './components/TooltipProvider/TooltipProviderTypes'

// this content will be replaced in build time with the `react-tooltip.css` builded content
const TooltipStyles = 'temp-content-for-styles'

// @ts-ignore
styleInject(TooltipStyles)

export { TooltipController as Tooltip } from './components/TooltipController'
export { TooltipProvider, TooltipWrapper } from './components/TooltipProvider'
export type {
  ChildrenType,
  DataAttribute,
  EventsType,
  PlacesType,
  PositionStrategy,
  VariantType,
  WrapperType,
  ITooltipController as ITooltip,
  ITooltipWrapper,
  IPosition,
  Middleware,
}
