/* eslint-disable import/no-unresolved */
import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import HomepageSponsored from '@site/src/components/HomepageSponsored'
import AdsContainerElement from '@site/src/components/AdsContainerElement'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__logo">
          <img src="img/logo.svg" alt="Happy face with a tooltip saying 'Hello I'm a tooltip'" />
        </p>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/category/upgrade-guide">
            Upgrade from V4 to V5
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/getting-started">
            Getting Started with V5
          </Link>
        </div>
      </div>
      <div className={styles.heroAds}>
        <AdsContainerElement />
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  // const { siteConfig } = useDocusaurusContext()
  return (
    // <Layout title={`${siteConfig.title}`} description="Awesome React Tooltip component">
    <Layout title="Welcome" description="Awesome React Tooltip component">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageSponsored />
      </main>
    </Layout>
  )
}
