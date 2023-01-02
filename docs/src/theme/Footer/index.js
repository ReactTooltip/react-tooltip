/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react'
import Footer from '@theme-original/Footer'
// import AdsContainerElement from '@site/src/components/AdsContainerElement'

export default function FooterWrapper(props) {
  let shadoWindow = null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      shadoWindow = window
      const scriptElement = document.createElement('script')
      scriptElement.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7420210265158247'
      scriptElement.async = true
      scriptElement.onload = () => {
        if (typeof window !== 'undefined') {
          window.onload = () => {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        }
      }
      document.body.appendChild(scriptElement)
    }
  }, [])

  return (
    <>
      {shadoWindow && shadoWindow.document.body.clientWidth <= 768 && (
        <ins
          className="adsbygoogle"
          style={{
            bottom: 0,
            display: 'block',
            position: 'fixed',
            width: '100%',
            maxHeight: '100px',
            height: '75px',
          }}
          data-ad-client="ca-pub-7420210265158247"
          data-ad-slot="8159529807"
          data-full-width-responsive="true"
        />
      )}
      <Footer {...props} />
      {/* <AdsContainerElement id="mobile-anchor-ads" /> */}
    </>
  )
}
