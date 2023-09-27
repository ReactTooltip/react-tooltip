/* eslint-disable import/no-unresolved */
import React from 'react'
// @ts-ignore
import LogoFrigade from '@site/static/img/sponsors/frigade.png'
// @ts-ignore
import LogoDopt from '@site/static/img/sponsors/dopt.png'
import './styles.css'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any
  }
}

const SPONSORS = {
  frigade: {
    logo: LogoFrigade,
    title: 'Frigade',
  },
  dopt: {
    logo: LogoDopt,
    title: 'Dopt',
  },
}

interface BannerSponsorProps {
  sponsorKey: keyof typeof SPONSORS
}

const BannerSponsor = ({ sponsorKey }: BannerSponsorProps) => {
  const sponsor = SPONSORS[sponsorKey]

  const onClickSponsorBannerEventHandler = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []

      window.dataLayer.push({
        event: `click_${sponsorKey}_banner`,
        place: 'sidebar',
      })
    }

    return true
  }

  return (
    <div className="sponsor-banner">
      <a
        href="https://frigade.com/?source=react-tooltip"
        title={sponsor.title}
        target="_blank"
        rel="noreferrer"
        onClick={onClickSponsorBannerEventHandler}
      >
        <img src={sponsor.logo} alt={sponsor.title} />
      </a>
    </div>
  )
}

export default BannerSponsor
