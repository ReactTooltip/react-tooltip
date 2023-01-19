import { computePosition, offset, shift, arrow, flip } from '@floating-ui/dom'
import type { IComputePositions } from './compute-positions-types'

export const computeTooltipPosition = async ({
  elementReference = null,
  tooltipReference = null,
  tooltipArrowReference = null,
  place = 'top',
  offset: offsetValue = 10,
  strategy = 'absolute',
  middlewares = [offset(Number(offsetValue)), flip(), shift({ padding: 5 })],
}: IComputePositions) => {
  if (!elementReference) {
    // elementReference can be null or undefined and we will not compute the position
    // eslint-disable-next-line no-console
    // console.error('The reference element for tooltip was not defined: ', elementReference)
    return { tooltipStyles: {}, tooltipArrowStyles: {} }
  }

  if (tooltipReference === null) {
    return { tooltipStyles: {}, tooltipArrowStyles: {} }
  }

  const middleware = middlewares

  if (tooltipArrowReference) {
    middleware.push(arrow({ element: tooltipArrowReference as HTMLElement, padding: 5 }))

    return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
      placement: place,
      strategy,
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      const styles = { left: `${x}px`, top: `${y}px` }

      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? { x: 0, y: 0 }

      const staticSide =
        {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]] ?? 'bottom'

      const arrowStyle = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      }

      return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle }
    })
  }

  return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
    placement: 'bottom',
    strategy,
    middleware,
  }).then(({ x, y }) => {
    const styles = { left: `${x}px`, top: `${y}px` }

    return { tooltipStyles: styles, tooltipArrowStyles: {} }
  })
}
