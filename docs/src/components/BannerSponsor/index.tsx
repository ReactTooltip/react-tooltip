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
    href: 'https://frigade.com/',
  },
  dopt: {
    logo: LogoDopt,
    title: 'Dopt',
    href: 'https://dopt.com/',
  },
}

interface BannerSponsorProps {
  sponsorKey: keyof typeof SPONSORS
  tier: 'gold' | 'silver'
}

const BannerSponsor = ({ sponsorKey, tier }: BannerSponsorProps) => {
  const sponsor = SPONSORS[sponsorKey]

  const onClickSponsorBannerEventHandler = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []

      window.dataLayer.push({
        event: `click_sponsor_banner`,
        place: 'sidebar',
        sponsorKey,
        sponsorTitle: sponsor.title,
      })
    }

    return true
  }

  return (
    <div className={`sponsor-banner sponsor-banner-${tier}`}>
      <a
        href={`${sponsor.href}?source=react-tooltip`}
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
