/* eslint-disable import/no-unresolved */
import React from 'react'
import AdsContainerElement from '@site/src/components/AdsContainerElement'
import BannerFrigade from '@site/src/components/BannerFrigade'
import './styles.css'

const AdsContainer = () => {
  return (
    <div className="fixed">
      <BannerFrigade />
      <AdsContainerElement />
    </div>
  )
}

export default AdsContainer
