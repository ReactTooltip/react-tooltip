/* eslint-disable import/no-unresolved */
import React from 'react'
import AdsContainerElement from '@site/src/components/AdsContainerElement'
import BannerSponsor from '@site/src/components/BannerSponsor'
import './styles.css'

const AdsContainer = () => {
  return (
    <div className="fixed">
      <BannerSponsor sponsorKey="frigade" />
      <BannerSponsor sponsorKey="dopt" />
      <AdsContainerElement />
    </div>
  )
}

export default AdsContainer
