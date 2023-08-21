import React, { useEffect, useRef } from 'react'
import './styles.css'

const AdsContainerElement = () => {
  const containerRef = useRef<any>()

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

  return <div className="carbon-ads" ref={containerRef} />
}

export default AdsContainerElement
