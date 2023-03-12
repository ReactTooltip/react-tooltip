import * as esbuild from 'esbuild'
import cssModulesPlugin from 'esbuild-css-modules-plugin'
import fs from 'fs'

const buildsConfig = [
  {
    format: 'esm',
    outfile: 'dist/react-tooltip.mjs',
    minify: false,
  },
  {
    format: 'cjs',
    outfile: 'dist/react-tooltip.cjs',
    minify: false,
  },
  {
    format: 'iife',
    outfile: 'dist/react-tooltip.iife.js',
    minify: false,
  },
  {
    format: 'esm',
    outfile: 'dist/react-tooltip.js', // for styles be exported as `react-tooltip.css`
    minify: false,
  },
  {
    format: 'esm',
    outfile: 'dist/react-tooltip.min.mjs',
    minify: true,
  },
  {
    format: 'cjs',
    outfile: 'dist/react-tooltip.min.cjs',
    minify: true,
  },
  {
    format: 'iife',
    outfile: 'dist/react-tooltip.min.iife.js',
    minify: true,
  },
]

const builds = await Promise.all(
  buildsConfig.map(({ format, outfile, minify }) =>
    esbuild.build({
      entryPoints: ['./src/index.tsx'],
      bundle: true,
      outfile,
      format,
      treeShaking: true,
      minify,
      sourcemap: true,
      external: ['react', 'react-dom', 'prop-types'],
      plugins: [
        cssModulesPlugin({
          // inject: true,
          v2: true,
          v2CssModulesOption: {
            pattern: `react-tooltip__[local]_[hash]`,
          },
        }),
      ],
    }),
  ),
)

const toDelete = new Set()
builds.forEach((build) => {
  const outputs = Object.keys(build.metafile.outputs)
  outputs.forEach((output) => {
    /**
     * delete all redundant `.css` and `.css.map` files
     * except the ones we actually want to keep
     */
    if (/react-tooltip\.css(\.map)?$/.test(output)) {
      return
    }
    if (/\.css(\.map)?$/.test(output)) {
      toDelete.add(output)
    }
  })
})

/**
 * delete the extra build files from the CSS build
 */
toDelete.add('dist/react-tooltip.js')
toDelete.add('dist/react-tooltip.js.map')

toDelete.forEach((file) => {
  fs.unlink(file, () => null)
})
