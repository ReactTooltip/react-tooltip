/**
 *
 * @param property CSS attribute
 * @param value Value of the CSS Attribute
 * @returns The value of the CSS Attribute is returned if it is supported, otherwise false
 */
const cssSupports = (property: string, value: string): boolean => {
  const hasCssSupports = 'CSS' in window && 'supports' in window.CSS
  return hasCssSupports ? window.CSS.supports(property, value) : false
}

export default cssSupports
