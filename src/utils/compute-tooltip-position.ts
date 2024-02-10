import { computePosition, offset, shift, arrow, flip } from '@floating-ui/dom'
import type { IComputePositionArgs } from './compute-tooltip-position-types'

const computeTooltipPosition = async ({
  elementReference = null,
  tooltipReference = null,
  tooltipArrowReference = null,
  place = 'top',
  offset: offsetValue = 10,
  strategy = 'absolute',
  middlewares = [
    offset(Number(offsetValue)),
    flip({
      fallbackAxisSideDirection: 'start',
    }),
    shift({ padding: 5 }),
  ],
  border,
}: IComputePositionArgs) => {
  if (!elementReference) {
    // elementReference can be null or undefined and we will not compute the position
    // eslint-disable-next-line no-console
    // console.error('The reference element for tooltip was not defined: ', elementReference)
    return { tooltipStyles: {}, tooltipArrowStyles: {}, place }
  }

  if (tooltipReference === null) {
    return { tooltipStyles: {}, tooltipArrowStyles: {}, place }
  }

  const middleware = middlewares

  if (tooltipArrowReference) {
    middleware.push(arrow({ element: tooltipArrowReference as HTMLElement, padding: 5 }))

    return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
      placement: place,
      strategy,
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      const styles = { left: `${x}px`, top: `${y}px`, border }

      /* c8 ignore start */
      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? { x: 0, y: 0 }

      const staticSide =
        {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]] ?? 'bottom'
      /* c8 ignore end */

      const borderSide = border && {
        borderBottom: border,
        borderRight: border,
      }

      let borderWidth = 0
      if (border) {
        const match = `${border}`.match(/(\d+)px/)
        if (match?.[1]) {
          borderWidth = Number(match[1])
        } else {
          /**
           * this means `border` was set without `width`,
           * or non-px value (such as `medium`, `thick`, ...)
           */
          borderWidth = 1
        }
      }

      /* c8 ignore start */
      const arrowStyle = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        ...borderSide,
        [staticSide]: `-${4 + borderWidth}px`,
      }
      /* c8 ignore end */

      return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle, place: placement }
    })
  }

  return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
    placement: 'bottom',
    strategy,
    middleware,
  }).then(({ x, y, placement }) => {
    const styles = { left: `${x}px`, top: `${y}px` }

    return { tooltipStyles: styles, tooltipArrowStyles: {}, place: placement }
  })
}

export default computeTooltipPosition
