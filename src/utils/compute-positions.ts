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
  border = null,
}: IComputePositions) => {
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

      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? { x: 0, y: 0 }

      const staticSide =
        {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]] ?? 'bottom'

      const borderSide =
        border &&
        {
          top: { borderBottom: border, borderRight: border },
          right: { borderBottom: border, borderLeft: border },
          bottom: { borderTop: border, borderLeft: border },
          left: { borderTop: border, borderRight: border },
        }[placement.split('-')[0]]

      const arrowStyle = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        ...{ ...borderSide },
        [staticSide]: border ? '-5px' : '-4px',
      }

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
