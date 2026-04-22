function parseDataTooltipIdSelector(selector: string) {
  const match = selector.match(/^\[data-tooltip-id=(['"])((?:\\.|(?!\1).)*)\1\]$/)

  if (!match) {
    return null
  }

  return match[2].replace(/\\(['"])/g, '$1')
}

export default parseDataTooltipIdSelector
