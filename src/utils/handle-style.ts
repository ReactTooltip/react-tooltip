// This is the ID for the core styles of ReactTooltip
const REACT_TOOLTIP_CORE_STYLES_ID = 'react-tooltip-core-styles'
// This is the ID for the visual styles of ReactTooltip
const REACT_TOOLTIP_BASE_STYLES_ID = 'react-tooltip-base-styles'

const injected = {
  core: false,
  base: false,
}

function injectStyle({
  css,
  id = REACT_TOOLTIP_BASE_STYLES_ID,
  type = 'base',
  ref,
}: {
  css: string
  id?: string
  type?: 'core' | 'base'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any
}) {
  if (!css || typeof document === 'undefined' || injected[type]) {
    return
  }

  if (
    type === 'core' &&
    typeof process !== 'undefined' && // this validation prevents docs from breaking even with `process?`
    process?.env?.REACT_TOOLTIP_DISABLE_CORE_STYLES
  ) {
    return
  }

  if (
    type !== 'base' &&
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

  if (document.getElementById(id)) {
    // this should never happen because of `injected[type]`
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[react-tooltip] Element with id '${id}' already exists. Call \`removeStyle()\` first`,
      )
    }
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

  injected[type] = true
}

/**
 * @deprecated Use the `disableStyleInjection` tooltip prop instead.
 * See https://react-tooltip.com/docs/examples/styling#disabling-reacttooltip-css
 */
function removeStyle({
  type = 'base',
  id = REACT_TOOLTIP_BASE_STYLES_ID,
}: {
  type?: 'core' | 'base'
  id?: string
} = {}) {
  if (!injected[type]) {
    return
  }

  if (type === 'core') {
    // eslint-disable-next-line no-param-reassign
    id = REACT_TOOLTIP_CORE_STYLES_ID
  }

  const style = document.getElementById(id)
  if (style?.tagName === 'style') {
    style?.remove()
  } else if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `[react-tooltip] Failed to remove 'style' element with id '${id}'. Call \`injectStyle()\` first`,
    )
  }

  injected[type] = false
}

export { injectStyle, removeStyle }
