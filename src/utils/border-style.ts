import type { CSSProperties } from 'react'

/**
 * Extract the width token from a CSS border shorthand so arrow styles can
 * reuse the same thickness as the tooltip border.
 */
const getBorderWidth = (border?: CSSProperties['border']) => {
  if (!border) {
    return '0px'
  }

  const match = `${border}`.match(/(\d+px)/)
  return match?.[1] ?? '1px'
}

/**
 * Extract the color token from a CSS border shorthand so the arrow border/fill
 * can stay visually aligned with the tooltip border.
 */
const getBorderColor = (border?: CSSProperties['border']) => {
  if (!border) {
    return undefined
  }

  const parts = `${border}`.trim().split(/\s+/)
  if (parts.length >= 3) {
    return parts.slice(2).join(' ')
  }
  if (parts.length === 2) {
    return parts[1]
  }
  return parts[0]
}

export { getBorderWidth, getBorderColor }
