const isScrollable = (node: Element) => {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false
  }
  const style = getComputedStyle(node)
  return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
    const value = style.getPropertyValue(propertyName)
    return value === 'auto' || value === 'scroll'
  })
}

export const getScrollParent = (node: Element | null) => {
  if (!node) {
    return null
  }
  let currentParent = node.parentElement
  while (currentParent) {
    if (isScrollable(currentParent)) {
      return currentParent
    }
    currentParent = currentParent.parentElement
  }
  return document.scrollingElement || document.documentElement
}
