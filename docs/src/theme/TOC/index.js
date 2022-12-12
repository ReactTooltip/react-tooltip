import React from 'react'
import TOC from '@theme-original/TOC'

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7420210265158247"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7420210265158247"
        data-ad-slot="8711379942"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </>
  )
}
