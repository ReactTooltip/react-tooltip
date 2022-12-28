import React, { useEffect } from 'react'
import styles from './styles.module.css'

const AdsContainerElement = ({ id }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('AdsContainerMounted', { detail: { id } }))
    }
  }, [])

  return <div id={id} className={styles.adsContainer} />
}

export default AdsContainerElement
