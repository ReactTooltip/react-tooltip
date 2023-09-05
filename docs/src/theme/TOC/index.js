/* eslint-disable import/no-unresolved */
import React from 'react'
import TOC from '@theme-original/TOC'
import AdsContainerElement from '@site/src/components/AdsContainerElement'
import LogoFrigade from '@site/static/img/sponsors/frigade.png'

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <div
        style={{
          position: 'fixed',
        }}
      >
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
        <AdsContainerElement />
      </div>
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block', position: 'fixed', width: '300px', height: '600px' }}
        data-ad-client="ca-pub-7420210265158247"
        data-ad-slot="8711379942"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
    </>
  )
}
