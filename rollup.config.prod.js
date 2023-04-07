import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import postcss from 'rollup-plugin-postcss'
import progress from 'rollup-plugin-progress'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import typescript from 'typescript'
import * as pkg from './package.json'

const input = ['src/index.tsx']

const name = 'ReactTooltip'

const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
]

const buildFormats = [
  {
    file: 'dist/react-tooltip.umd.js',
    format: 'umd',
    globals: {
      '@floating-ui/dom': 'FloatingUIDOM',
      react: 'React',
      'react-dom': 'ReactDOM',
      classnames: 'classNames',
      'prop-types': 'PropTypes',
    },
  },
  {
    file: 'dist/react-tooltip.cjs',
    format: 'cjs',
  },
  {
    file: 'dist/react-tooltip.mjs',
    format: 'es',
  },
]

const sharedPlugins = [
  progress(),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  }),
  nodeResolve(),
  ts({
    typescript,
    tsconfig: './tsconfig.json',
    noEmitOnError: false,
    // declaration: true,
    // declarationDir: './build',
  }),
  commonjs({
    include: 'node_modules/**',
  }),
]
// this step is just to build the minified javascript files
const minifiedBuildFormats = buildFormats.map(({ file, ...rest }) => ({
  file: file.replace(/(\.[cm]?js)$/, '.min$1'),
  ...rest,
  minify: true,
  plugins: [terser(), filesize()],
}))

const allBuildFormats = [...buildFormats, ...minifiedBuildFormats]

const config = allBuildFormats.map(
  ({ file, format, globals, plugins: specificPlugins, minify }) => {
    const plugins = [
      ...sharedPlugins,
      postcss({
        extract: minify ? 'react-tooltip.min.css' : 'react-tooltip.css', // this will generate a specific file and override on multiples build, but the css will be the same
        autoModules: true,
        include: '**/*.css',
        extensions: ['.css'],
        plugins: [],
        minimize: Boolean(minify),
      }),
    ]

    if (specificPlugins && specificPlugins.length) {
      plugins.push(...specificPlugins)
    }

    return {
      input,
      output: {
        file,
        format,
        name,
        globals,
        sourcemap: true,
      },
      external,
      plugins,
    }
  },
)

export default config
