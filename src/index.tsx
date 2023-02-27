import './tokens.css'
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
