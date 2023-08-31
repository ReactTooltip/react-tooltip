import React, { useEffect, useRef } from 'react'
import './styles.css'

const AdsContainerElement = () => {
  const containerRef = useRef<any>()
  const containerRef2 = useRef<any>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scriptElement = document.createElement('script')
      scriptElement.src = '//cdn.carbonads.com/carbon.js?serve=CWYD553L&placement=react-tooltipcom'
      scriptElement.id = '_carbonads_js'
      scriptElement.async = true

      if (containerRef?.current) {
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(scriptElement)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window?.document?.body?.clientHeight >= 950) {
      const scriptElement = document.createElement('script')
      scriptElement.src = '//cdn.carbonads.com/carbon.js?serve=CWYD553L&placement=react-tooltipcom'
      scriptElement.id = '_carbonads_js'
      scriptElement.async = true

      if (containerRef2?.current) {
        containerRef2.current.innerHTML = ''
        containerRef2.current.appendChild(scriptElement)
      }
    }
  }, [])

  return (
    <>
      <div className="carbon-ads" ref={containerRef} />
      <div className="carbon-ads" ref={containerRef2} />
    </>
  )
}

export default AdsContainerElement
