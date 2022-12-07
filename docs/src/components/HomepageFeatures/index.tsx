/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/only-tooltip-top.svg').default,
    description: (
      <>ReactTooltip was designed with love from the ground up to be easily installed and used.</>
    ),
  },
  {
    title: 'Open Source',
    Svg: require('@site/static/img/github.svg').default,
    description: (
      <>
        An Open Source project built by developers to developers, we work together with the
        community to always try to improve ReactTooltip.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/happy-face-tooltip.svg').default,
    description: (
      <>
        Don&rsquo;t waste your time building a tooltip component from scratch, just use ReactTooltip
        and focus on new features or bug fixes.
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
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
