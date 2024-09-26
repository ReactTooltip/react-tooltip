// This is the ID for the core styles of ReactTooltip
const REACT_TOOLTIP_CORE_STYLES_ID = 'react-tooltip-core-styles'
// This is the ID for the visual styles of ReactTooltip
const REACT_TOOLTIP_BASE_STYLES_ID = 'react-tooltip-base-styles'

const injected = {
  core: false,
  base: false,
}

/**
 * Note about `state` parameter:
 * This parameter is used to keep track of the state of the styles
 * into the tests since the const `injected` is not acessible or resettable in the tests
 */
function injectStyle({
  css,
  id = REACT_TOOLTIP_BASE_STYLES_ID,
  type = 'base',
  ref,
  state = {},
}: {
  css: string
  id?: string
  type?: 'core' | 'base'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any
  state: { [key: string]: boolean }
}) {
  if (
    !css ||
    typeof document === 'undefined' ||
    (typeof state[type] !== 'undefined' ? state[type] : injected[type])
  ) {
    return
  }

  if (
    type === 'core' &&
    typeof process !== 'undefined' && // this validation prevents docs from breaking even with `process?`
    process.env &&
    process.env.REACT_TOOLTIP_DISABLE_CORE_STYLES
  ) {
    return
  }

  if (
    type === 'base' &&
    typeof process !== 'undefined' && // this validation prevents docs from breaking even with `process?`
    process.env &&
    process.env.REACT_TOOLTIP_DISABLE_BASE_STYLES
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

  if (document.getElementById(id)) {
    // this could happen in cases the tooltip is imported by multiple js modules
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

  if (typeof state[type] !== 'undefined') {
    // eslint-disable-next-line no-param-reassign
    state[type] = true
  } else {
    injected[type] = true // internal global state that jest doesn't have access
  }
}

export { injectStyle, injected }
