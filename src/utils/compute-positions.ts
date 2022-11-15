import { computePosition, offset, flip, shift, arrow } from '@floating-ui/dom'

export const computeToolTipPosition = async ({
  elementReference,
  tooltipReference = null,
  tooltipArrowReference = null,
  place = 'top',
  offset: offsetValue = 10,
}) => {
  if (tooltipReference === null) {
    return { tooltipStyles: {}, tooltipArrowStyles: {} }
  }

  const middleware = [offset(offsetValue), flip(), shift({ padding: 5 })]

  if (tooltipArrowReference) {
    middleware.push(arrow({ element: tooltipArrowReference }))

    return computePosition(elementReference, tooltipReference, {
      placement: place,
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      const styles = { left: `${x}px`, top: `${y}px` }

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
        [staticSide]: '-4px',
      }

      return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle }
    })
  }

  return computePosition(elementReference, tooltipReference, {
    placement: 'bottom',
    middleware,
  }).then(({ x, y }) => {
    const styles = { left: `${x}px`, top: `${y}px` }

    return { tooltipStyles: styles, tooltipArrowStyles: {} }
  })
}
