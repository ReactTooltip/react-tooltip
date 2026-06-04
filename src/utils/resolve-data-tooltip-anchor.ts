function resolveDataTooltipAnchor(targetElement: Element, tooltipId: string) {
  let currentElement: Element | null = targetElement

  while (currentElement) {
    const dataset = (currentElement as Element & { dataset?: DOMStringMap }).dataset
    if (dataset?.tooltipId === tooltipId) {
      return currentElement
    }
    currentElement = currentElement.parentElement
  }

  return null
}

export default resolveDataTooltipAnchor
