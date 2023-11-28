/* eslint-disable import/no-unresolved */
import React from 'react'
import TOC from '@theme-original/TOC'
import AdsContainer from '@site/src/components/AdsContainer'

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <AdsContainer />
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block', position: 'fixed', width: '300px', height: '600px' }}
        data-ad-client="ca-pub-7420210265158247"
        data-ad-slot="8711379942"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
    </>
  )
}
