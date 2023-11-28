import './tokens.css'

import { injectStyle } from 'utils/handle-style'

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
  TooltipRefProps,
} from './components/Tooltip/TooltipTypes'
import type { ITooltipController } from './components/TooltipController/TooltipControllerTypes'
import type { ITooltipWrapper } from './components/TooltipProvider/TooltipProviderTypes'

// those content will be replaced in build time with the `react-tooltip.css` builded content
const TooltipCoreStyles = 'react-tooltip-core-css-placeholder'
const TooltipStyles = 'react-tooltip-css-placeholder'

if (typeof window !== 'undefined') {
  window.addEventListener('react-tooltip-inject-styles', ((
    event: CustomEvent<{ disableCore: boolean; disableBase: boolean }>,
  ) => {
    if (!event.detail.disableCore) {
      injectStyle({ css: TooltipCoreStyles, type: 'core' })
    }
    if (!event.detail.disableBase) {
      injectStyle({ css: TooltipStyles, type: 'base' })
    }
  }) as EventListener)
}

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
  TooltipRefProps,
}

export { removeStyle } from './utils/handle-style'
