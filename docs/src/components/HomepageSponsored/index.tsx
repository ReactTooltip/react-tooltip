/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/no-unused-prop-types
  src?: any
  // eslint-disable-next-line react/no-unused-prop-types
  eventTitle?: string
  link: string
}

type SponsorItem = FeatureItem & {
  tier: 'gold' | 'silver'
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Digital Ocean',
    Svg: require('@site/static/img/digital-ocean-powered-by.svg').default,
    link: 'https://www.digitalocean.com/?refcode=0813b3be1161&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge',
  },
  {
    title: 'Algolia',
    Svg: require('@site/static/img/Algolia-logo.svg').default,
    link: 'https://docsearch.algolia.com/',
  },
]

const SponsorList: SponsorItem[] = [
  {
    title: 'Frigade',
    src: require('@site/static/img/sponsors/frigade.png').default,
    link: 'https://frigade.com/?source=react-tooltip',
    eventTitle: 'frigade',
    tier: 'gold',
  },
  {
    title: 'Dopt',
    src: require('@site/static/img/sponsors/dopt.png').default,
    link: 'https://dopt.com/?source=react-tooltip',
    eventTitle: 'dopt',
    tier: 'silver',
  },
]

function Feature({ title, Svg, link }: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <a href={link} title={title} target="_blank" rel="noreferrer">
          <Svg className={styles.featureSvg} role="img" />
        </a>
      </div>
    </div>
  )
}

export default function HomepageSponsored(): JSX.Element {
  const onClickSponsorBannerEventHandler = (title: string) => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []

      window.dataLayer.push({
        event: `click_${title}_banner`,
        place: 'home',
      })
    }

    return true
  }

  const goldSponsors = SponsorList.filter(({ tier }) => tier === 'gold')
  const silverSponsors = SponsorList.filter(({ tier }) => tier === 'silver')

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sponsoredBy}>
          <div>
            <h1 className={styles.sponsoredTitle}>Gold Sponsors 🌟</h1>
            <div className="row">
              {goldSponsors.map(({ link, title, src, eventTitle }, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={idx} className={clsx(`col col--${12 / goldSponsors.length}`)}>
                  <div className="text--center">
                    <a
                      href={link}
                      title={title}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        onClickSponsorBannerEventHandler(eventTitle)
                      }}
                    >
                      <img src={src} alt={title} width={480} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className={styles.sponsoredTitle}>Silver Sponsors ✪</h2>
            <div className="row">
              {silverSponsors.map(({ link, title, src, eventTitle }, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={idx} className={clsx(`col col--${12 / silverSponsors.length}`)}>
                  <div className="text--center">
                    <a
                      href={link}
                      title={title}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        onClickSponsorBannerEventHandler(eventTitle)
                      }}
                    >
                      <img src={src} alt={title} width={200} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h1 className={styles.sponsoredTitle}>Powered by</h1>
        <div className="row">
          {FeatureList.map((props, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
