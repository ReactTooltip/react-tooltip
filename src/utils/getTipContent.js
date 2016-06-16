/**
 * To get the tooltip content
 * it may comes from data-tip or this.props.children
 * it should support multiline
 *
 * @params
 * - `tip` {String} value of data-tip
 * - `children` {ReactElement} this.props.children
 * - `multiline` {Any} could be Bool(true/false) or String('true'/'false')
 *
 * @return
 * - String or react component
 */
import React from 'react'

export default function (tip, children, multiline) {
  if (children) return children

  const regexp = /<br\s*\/?>/
  if (!multiline || multiline === 'false' || !regexp.test(tip)) {
    return tip
  }

  // Multiline tooltip content
  return tip.split(regexp).map((d, i) => {
    return (
      <span key={i} className='multi-line'>{d}</span>
    )
  })
}
