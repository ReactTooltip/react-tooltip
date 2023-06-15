const REACT_TOOLTIP_STYLES_ID = 'react-tooltip-styles'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function injectStyle(css: string, ref?: any) {
  if (!ref) {
    // eslint-disable-next-line no-param-reassign
    ref = {}
  }
  const { insertAt } = ref

  if (!css || typeof document === 'undefined' || document.getElementById(REACT_TOOLTIP_STYLES_ID)) {
    return
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style: any = document.createElement('style')
  style.id = REACT_TOOLTIP_STYLES_ID
  style.type = 'text/css'

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild)
    } else {
      head.appendChild(style)
    }
  } else {
    head.appendChild(style)
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}

function removeStyle() {
  const style = document.getElementById(REACT_TOOLTIP_STYLES_ID)
  if (!style) {
    return
  }
  style.remove()
}

export { injectStyle, removeStyle }
