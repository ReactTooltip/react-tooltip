/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React from 'react'
import Layout from '@theme/Layout'
// @ts-ignore
import DigitalOceanBanner from '@site/static/img/digital-ocean-banner.webp'
// @ts-ignore
import DigitalOceanLogin from '@site/static/img/digital-ocean-login.webp'
// @ts-ignore
import DigitalOceanCreateApp from '@site/static/img/digital-ocean-create-app.webp'
// @ts-ignore
import DigitalOceanAppConfig1 from '@site/static/img/digital-ocean-app-config-1.png'
// @ts-ignore
import DigitalOceanAppConfig2 from '@site/static/img/digital-ocean-app-config-2.png'
// @ts-ignore
import DigitalOceanStaticSite from '@site/static/img/digital-ocean-static-site.png'
// @ts-ignore
import DigitalOceanCreateResource from '@site/static/img/digital-ocean-create-resource.png'
// @ts-ignore
import { Tooltip } from 'react-tooltip'

export default function Home(): JSX.Element {
  return (
    <Layout title="Deploy on DigitalOcean" description="Guide to hosting a site with React-Tooltip">
      <main
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <img
            src={DigitalOceanBanner}
            alt="DigitalOcean banner"
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              marginBottom: '1rem',
            }}
          />

          <h1>How to Deploy a Static Site on DigitalOcean</h1>
          <p>
            This guide walks you through deploying a static React site + React-Tooltip library,
            using DigitalOcean&apos;s App Platform. Follow these steps to get your site live quickly
            and easy!
          </p>

          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <h2>Examples of Using React-Tooltip</h2>
            <h3>1. Basic Tooltip</h3>
            <p>This example demonstrates a simple tooltip:</p>
            <div style={{ marginBottom: '1rem' }}>
              <a data-tooltip-id="my-tooltip" data-tooltip-content="Hello world!" href="#">
                ◕‿‿◕
              </a>
              <Tooltip id="my-tooltip" />
            </div>
            <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
              {`import {Tooltip} from 'react-tooltip';\n\n<a id="my-anchor-element">◕‿‿◕</a>\n\n<Tooltip anchorSelect="#my-anchor-element" content="Hello world!" />`}
            </pre>
            For more examples, check out the{' '}
            <b>
              <a href="docs/category/examples">React-Tooltip documentation</a>.
            </b>
          </div>

          <h2>1. Uploading the project to GitHub</h2>
          <p>
            Your project needs to be hosted on GitHub for easy integration with DigitalOcean.
            Here&apos;s how to do it:
          </p>
          <ol>
            <li>Create a new repository on GitHub and copy the repository URL.</li>
            <li>
              In your terminal, add the GitHub repository as a remote in your project folder:
              <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
                git remote add origin https://github.com/your-username/your-repo.git
              </pre>
            </li>
            <li>
              Commit any pending changes and push your code to the <code>main</code> branch:
              <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
                git add .{'\n'}
                git commit -m &quot;Initial commit&quot;{'\n'}
                git push -u origin main
              </pre>
            </li>
          </ol>

          <h2>2. Setting up DigitalOcean App Platform</h2>
          <p>DigitalOcean App Platform makes it easy to deploy static sites. Follow these steps:</p>
          <ol>
            <li>
              Log in to your{' '}
              <a href="https://www.digitalocean.com/?refcode=0813b3be1161&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge/">
                DigitalOcean
              </a>{' '}
              account or sign up for a new account.
              <img
                src={DigitalOceanLogin}
                alt="DigitalOcean Login"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
            <li>
              On the dashboard, click <strong>Create</strong> and select <strong>Apps</strong>.
              <img
                src={DigitalOceanCreateApp}
                alt="DigitalOcean Create App"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
            <li>
              Connect your GitHub account to DigitalOcean by following the on-screen instructions.
            </li>
            <li>
              Select your repository and branch. Usually, the <code>main</code> branch is used for
              production.
              <img
                src={DigitalOceanAppConfig1}
                alt="DigitalOcean App config pt.1"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
            <li>
              Specify the build output directory as <code>build/</code>, which is the default output
              folder for React projects.
              <img
                src={DigitalOceanAppConfig2}
                alt="DigitalOcean App config pt.2"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
            <li>
              Choose your deployment plan. You can have up to 3 static sites on free tier.
              <img
                src={DigitalOceanStaticSite}
                alt="DigitalOcean Static Site"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
            <li>
              Click <strong>Create Resources</strong> and wait for the process to complete.
              <img
                src={DigitalOceanCreateResource}
                alt="DigitalOcean Create Resource"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              />
            </li>
          </ol>

          <p>
            After the deployment finishes, DigitalOcean will provide a URL for your live site. Visit
            this URL and enjoy your live site!
          </p>

          <h2>Support</h2>
          <p>If you run into any issues, refer to:</p>
          <ul>
            <li>
              The <a href="https://www.digitalocean.com/docs/">DigitalOcean Documentation</a>
            </li>
            <li>
              The <a href="docs/category/examples">React-Tooltip Documentation</a>
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  )
}
