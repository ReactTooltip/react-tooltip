export const cssAttrIsValid = (attr: string, value: unknown) => {
  const iframe = document.createElement('iframe')
  Object.apply(iframe.style, {
    display: 'none',
    // in case `display: none` not supported
    width: '0px',
    height: '0px',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  document.body.appendChild(iframe)
  if (!iframe.contentDocument) {
    return true
  }
  const style = iframe.contentDocument.createElement('style')
  style.innerHTML = `.test-css { ${attr}: ${value}; }`
  iframe.contentDocument.head.appendChild(style)
  const { sheet } = style
  if (!sheet) {
    return true
  }
  const result = sheet.cssRules[0].cssText
  iframe.remove()
  const match = result.match(new RegExp(`${attr}:`))
  return !!match
}
