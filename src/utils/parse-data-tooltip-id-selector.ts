function parseDataTooltipIdSelector(selector: string) {
  // Extracts the quote character and raw attribute value from a [data-tooltip-id=...] selector.
  const match = selector.match(/^\[data-tooltip-id=(['"])((?:\\.|(?!\1).)*)\1\]$/)

  // Detects escapes other than quotes that require native selector fallback.
  const unsupportedEscapeRegex = /\\(?!['"])/

  if (!match || unsupportedEscapeRegex.test(match[2])) {
    return null
  }

  return match[2].replace(/\\(['"])/g, '$1')
}

export default parseDataTooltipIdSelector
