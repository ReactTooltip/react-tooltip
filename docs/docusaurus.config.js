/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer')
const postcssPresetEnv = require('postcss-preset-env')

const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

/** @return {import('@docusaurus/types').Plugin} */
function customPostCssPlugin() {
  return {
    name: 'custom-postcss',
    configurePostCss(options) {
      // Append new PostCSS plugins here.
      options.plugins.push(postcssPresetEnv) // allow newest CSS syntax
      return options
    },
  }
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Tooltip',
  tagline: 'Awesome React Tooltip component',
  url: 'https://react-tooltip.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ReactTooltip', // Usually your GitHub org/user name.
  projectName: 'ReactTooltip', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: [customPostCssPlugin],

  scripts: [
    // {
    //   src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
    //   async: true,
    // },
    // {
    //   src: '/js/gpt.js',
    //   async: true,
    // },
    // {
    //   src: '/js/ads.js',
    //   async: true,
    // },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v6',
              path: '',
            },
            '5.x': {
              label: 'v5',
              path: 'v5',
            },
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/ReactTooltip/react-tooltip/tree/master/docs/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/ReactTooltip/react-tooltip/tree/master/docs/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        // gtag: {
        //   trackingID: 'G-N15QWWS0MW',
        //   anonymizeIP: false,
        // },
        googleTagManager: {
          containerId: 'GTM-TH6VNCW',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'support_us',
        content:
          '⭐️ If you like ReactTooltip, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/ReactTooltip/react-tooltip">GitHub</a> ⭐️',
        backgroundColor: '#222',
        textColor: '#fff',
        isCloseable: false,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'CQB0RZ7E1F',

        // Public API key: it is safe to commit it
        apiKey: '97b68f94056a6d6fad56df43bf178866',

        indexName: 'react-tooltip',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // ... other Algolia params
      },
      navbar: {
        title: 'React Tooltip',
        logo: {
          alt: 'React Tooltip Logo',
          src: 'img/only-tooltip.svg',
          width: 120,
        },
        items: [
          {
            label: 'Docs',
            position: 'left',
            items: [
              {
                label: 'v6',
                to: '/docs/getting-started',
              },
              {
                label: 'v5',
                to: '/docs/v5/getting-started',
              },
            ],
          },
          {
            to: '/benchmark',
            position: 'left',
            label: 'Benchmark',
          },
          {
            href: 'https://github.com/ReactTooltip/react-tooltip/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started (v6)',
                to: '/docs/getting-started',
              },
              {
                label: 'Getting Started (v5)',
                to: '/docs/v5/getting-started',
              },
              {
                label: 'Deploying to DigitalOcean',
                to: '/blog/digital-ocean-app-platform',
              },
              {
                label: 'Benchmark',
                to: '/benchmark',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ReactTooltip/react-tooltip/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} React Tooltip. Docs built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
