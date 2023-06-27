// This is the ID for the core styles of ReactTooltip
const REACT_TOOLTIP_CORE_STYLES_ID = 'react-tooltip-core-styles'
// This is the ID for the visual styles of ReactTooltip
const REACT_TOOLTIP_BASE_STYLES_ID = 'react-tooltip-base-styles'

function injectStyle({
  css,
  id = REACT_TOOLTIP_BASE_STYLES_ID,
  type = 'base',
  ref,
}: {
  css: string
  id?: string
  type?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any
}) {
  if (
    type === 'core' &&
    typeof process !== 'undefined' && // this validation prevents docs from breaking even with `process?`
    process?.env?.REACT_TOOLTIP_DISABLE_CORE_STYLES
  ) {
    return
  }

  if (
    type !== 'core' &&
    typeof process !== 'undefined' && // this validation prevents docs from breaking even with `process?`
    process?.env?.REACT_TOOLTIP_DISABLE_BASE_STYLES
  ) {
    return
  }

  if (type === 'core') {
    // eslint-disable-next-line no-param-reassign
    id = REACT_TOOLTIP_CORE_STYLES_ID
  }

  if (!ref) {
    // eslint-disable-next-line no-param-reassign
    ref = {}
  }
  const { insertAt } = ref

  if (!css || typeof document === 'undefined' || document.getElementById(id)) {
    return
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style: any = document.createElement('style')
  style.id = id
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

function removeStyle({
  type = 'base',
  id = REACT_TOOLTIP_BASE_STYLES_ID,
}: {
  type?: string
  id?: string
} = {}) {
  if (type === 'core') {
    // eslint-disable-next-line no-param-reassign
    id = REACT_TOOLTIP_CORE_STYLES_ID
  }

  const style = document.getElementById(id)
  style?.remove()
}

export { injectStyle, removeStyle }
