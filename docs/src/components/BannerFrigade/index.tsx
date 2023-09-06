/* eslint-disable import/no-unresolved */
import React from 'react'
// @ts-ignore
import LogoFrigade from '@site/static/img/sponsors/frigade.png'
import './styles.css'

declare global {
  interface Window {
    dataLayer?: any
  }
}

const BannerFrigade = () => {
  const onClickFrigadeBannerEventHandler = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []

      window.dataLayer.push({
        event: `click_frigade_banner`,
        place: 'sidebar',
      })
    }

    return true
  }

  return (
    <div className="sponsor-frigade">
      <a
        href="https://frigade.com/?source=react-tooltip"
        title="Frigade"
        target="_blank"
        rel="noreferrer"
        onClick={onClickFrigadeBannerEventHandler}
      >
        <img src={LogoFrigade} alt="Frigade" />
      </a>
    </div>
  )
}

export default BannerFrigade
