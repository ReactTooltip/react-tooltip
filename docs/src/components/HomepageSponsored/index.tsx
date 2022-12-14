/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  link: string
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
  return (
    <section className={styles.features}>
      <div className="container">
        <h3 className={styles.sponsoredTitle}>Powered by</h3>
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
