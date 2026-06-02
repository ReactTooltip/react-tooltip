function resolveDataTooltipAnchor(targetElement: Element, tooltipId: string) {
  let currentElement: Element | null = targetElement

  while (currentElement) {
    if (currentElement instanceof HTMLElement && currentElement.dataset.tooltipId === tooltipId) {
      return currentElement
    }
    currentElement = currentElement.parentElement
  }

  return null
}

export default resolveDataTooltipAnchor
