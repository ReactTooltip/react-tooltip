/* eslint-disable import/no-unresolved */
import React from 'react'
import AdsContainerElement from '@site/src/components/AdsContainerElement'
import BannerSponsor from '@site/src/components/BannerSponsor'
import './styles.css'

const AdsContainer = () => {
  return (
    <div className="ads-container fixed">
      <BannerSponsor sponsorKey="frigade" tier="gold" />
      <AdsContainerElement />
      <BannerSponsor sponsorKey="dopt" tier="silver" />
    </div>
  )
}

export default AdsContainer
