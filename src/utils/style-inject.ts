function styleInject(css: string, ref?: any) {
  if (!ref) {
    // eslint-disable-next-line no-param-reassign
    ref = {}
  }
  const { insertAt } = ref

  if (!css || typeof document === 'undefined' || document.getElementById('react-tooltip-styles')) {
    return
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  const style: any = document.createElement('style')
  style.id = 'react-tooltip-styles'
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

export default styleInject
