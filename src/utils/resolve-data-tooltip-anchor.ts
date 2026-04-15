function resolveDataTooltipAnchor(targetElement: HTMLElement, tooltipId: string) {
  let currentElement: HTMLElement | null = targetElement

  while (currentElement) {
    if (currentElement.dataset.tooltipId === tooltipId) {
      return currentElement
    }
    currentElement = currentElement.parentElement
  }

  return null
}

export default resolveDataTooltipAnchor
