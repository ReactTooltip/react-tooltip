// import React, { useEffect } from 'react'
import React from 'react'
import TOC from '@theme-original/TOC'

// import styles from './index.module.css'

// const AdsContainerElement = ({ id }) => {
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       window.dispatchEvent(new CustomEvent('AdsContainerMounted', { detail: { id } }))
//     }
//   }, [])

//   return <div id={id} className={styles.adsContainer} />
// }

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      {/* <AdsContainerElement id="right-sidebar-ads" /> */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7420210265158247"
        data-ad-slot="8711379942"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  )
}
