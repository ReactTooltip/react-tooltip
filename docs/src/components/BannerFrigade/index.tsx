/* eslint-disable import/no-unresolved */
import React from 'react'
// @ts-ignore
import LogoFrigade from '@site/static/img/sponsors/frigade.png'
import './styles.css'

const BannerFrigade = () => {
  return (
    <div className="sponsor-frigade">
      <a
        href="https://frigade.com/?source=react-tooltip"
        title="Frigade"
        target="_blank"
        rel="noreferrer"
      >
        <img src={LogoFrigade} alt="Frigade" />
      </a>
    </div>
  )
}

export default BannerFrigade
