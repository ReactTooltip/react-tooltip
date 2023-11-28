const cssSupports = (property: string, value: string): boolean => {
  const hasCssSupports = 'CSS' in window && 'supports' in window.CSS
  return hasCssSupports ? window.CSS.supports(property, value) : true
}

export default cssSupports
