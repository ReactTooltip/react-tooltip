import * as esbuild from 'esbuild'
import cssModulesPlugin from 'esbuild-css-modules-plugin'
import fs from 'fs'
import { copyFile, readFile, unlink, writeFile } from 'fs/promises'

const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))

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
    globalName: 'ReactTooltip',
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
    outfile: 'dist/react-tooltip.iife.min.js',
    minify: true,
    globalName: 'ReactTooltip',
  },
  {
    format: 'esm',
    outfile: 'dist/react-tooltip.min.js',
    minify: true,
  },
]
const externals = Object.keys({ ...(pkg.peerDependencies ?? {}), ...(pkg.dependencies ?? {}) })

const builds = await Promise.all(
  buildsConfig.map(({ format, outfile, minify, globalName }) =>
    esbuild.build({
      entryPoints: ['./src/index.tsx'],
      bundle: true,
      outfile,
      format,
      globalName,
      treeShaking: true,
      minify,
      sourcemap: true,
      metafile: true,
      external: externals,
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

const cssPath = 'dist/react-tooltip.css'
const minCssPath = 'dist/react-tooltip.min.css'
const regularCss = await readFile(cssPath, 'utf8')
const minifiedCssResult = await esbuild.transform(regularCss, {
  loader: 'css',
  minify: true,
})
const minifiedCss = minifiedCssResult.code.trim()

await writeFile(minCssPath, `${minifiedCss}\n`)
await copyFile('src/tokens.css', 'dist/react-tooltip-tokens.css')

const replaceCssPlaceholders = async (file, cssContent) => {
  const js = await readFile(file, 'utf8')
  const cssLiteral = JSON.stringify(cssContent)
  const replacedBase = js
    .replaceAll('"react-tooltip-css-placeholder"', cssLiteral)
    .replaceAll("'react-tooltip-css-placeholder'", cssLiteral)
  const replacedAll = replacedBase
    .replaceAll('"react-tooltip-core-css-placeholder"', cssLiteral)
    .replaceAll("'react-tooltip-core-css-placeholder'", cssLiteral)
  await writeFile(file, replacedAll)
}

await Promise.all([
  replaceCssPlaceholders('dist/react-tooltip.mjs', regularCss),
  replaceCssPlaceholders('dist/react-tooltip.cjs', regularCss),
  replaceCssPlaceholders('dist/react-tooltip.iife.js', regularCss),
  replaceCssPlaceholders('dist/react-tooltip.min.mjs', minifiedCss),
  replaceCssPlaceholders('dist/react-tooltip.min.cjs', minifiedCss),
  replaceCssPlaceholders('dist/react-tooltip.iife.min.js', minifiedCss),
])

await Promise.all([
  unlink('dist/react-tooltip.css.map').catch(() => null),
  unlink('dist/react-tooltip.min.js').catch(() => null),
  unlink('dist/react-tooltip.min.js.map').catch(() => null),
])
