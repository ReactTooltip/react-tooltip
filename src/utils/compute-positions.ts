import { computePosition, offset, flip, shift, arrow } from '@floating-ui/dom'
import type { IComputePositions } from './compute-positions-types'

export const computeToolTipPosition = async ({
  elementReference = null,
  tooltipReference = null,
  tooltipArrowReference = null,
  place = 'top',
  offset: offsetValue = 10,
}: IComputePositions) => {
  if (elementReference === null) {
    // eslint-disable-next-line no-console
    console.error('The reference element for tooltip was not defined: ', elementReference)
    return { tooltipStyles: {}, tooltipArrowStyles: {} }
  }

  if (tooltipReference === null) {
    return { tooltipStyles: {}, tooltipArrowStyles: {} }
  }

  const middleware = [offset(offsetValue), flip(), shift({ padding: 5 })]

  if (tooltipArrowReference) {
    middleware.push(arrow({ element: tooltipArrowReference as HTMLElement }))

    return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
      placement: place,
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      const styles = { left: `${x}px`, top: `${y}px` }

      // @ts-ignore
      const { x: arrowX, y: arrowY } = middlewareData.arrow

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]]

      const arrowStyle = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        // @ts-ignore
        [staticSide]: '-4px',
      }

      return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle }
    })
  }

  return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
    placement: 'bottom',
    middleware,
  }).then(({ x, y }) => {
    const styles = { left: `${x}px`, top: `${y}px` }

    return { tooltipStyles: styles, tooltipArrowStyles: {} }
  })
}
