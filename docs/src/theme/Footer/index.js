import React, { useEffect } from 'react'
import Footer from '@theme-original/Footer'

export default function FooterWrapper(props) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  return <Footer {...props} />
}
