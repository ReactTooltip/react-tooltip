const cssSupports = (property: string, value: string): boolean => {
  const hasCssSupports = 'CSS' in window && 'supports' in window.CSS
  if (!hasCssSupports) {
    return true
  }
  return window.CSS.supports(property, value)
}

export default cssSupports
