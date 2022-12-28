/* eslint-disable import/no-unresolved */
import React from 'react'
import TOC from '@theme-original/TOC'
import AdsContainerElement from '@site/src/components/AdsContainerElement'

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <AdsContainerElement id="right-sidebar-ads" />
    </>
  )
}
