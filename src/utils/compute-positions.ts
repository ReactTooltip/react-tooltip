import { computePosition, offset, flip, shift } from '@floating-ui/dom'

export const computeToolTipPosition = async ({ elementReference, tooltipReference }) => {
  if (tooltipReference === null) {
    return {}
  }

  return computePosition(elementReference, tooltipReference, {
    placement: 'bottom',
    middleware: [offset(5), flip(), shift({ padding: 5 })],
  }).then(({ x, y, placement, middlewareData }) => {
    const styles = { left: `${x}px`, top: `${y}px` }

    return styles
  })
}
