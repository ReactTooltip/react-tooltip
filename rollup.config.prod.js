import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import postcss from 'rollup-plugin-postcss'
import progress from 'rollup-plugin-progress'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import typescript from 'typescript'
import pkg from './package.json'

const input = ['src/index.tsx']

const name = 'ReactTooltip'

const external = ['react', 'react-dom', 'prop-types']

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  classnames: 'classNames',
  'prop-types': 'PropTypes',
}

// splitted to be reusable by minified css build and unminified css
const pluginsBeforePostCSS = [
  progress(),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  }),
]

// splitted to be reusable by minified css build and unminified css
const pluginsAfterPostCSS = [
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

const plugins = [
  ...pluginsBeforePostCSS,
  postcss({
    // extract: true, // this will generate a css file based on output file name
    extract: 'react-tooltip.css', // this will generate a specific file and override on multiples build, but the css will be the same
    autoModules: true,
    include: '**/*.css',
    extensions: ['.css'],
    plugins: [],
  }),
  ...pluginsAfterPostCSS,
]

const pluginsForCSSMinification = [
  ...pluginsBeforePostCSS,
  postcss({
    extract: 'react-tooltip.min.css', // this will generate a specific file and override on multiples build, but the css will be the same
    autoModules: true,
    include: '**/*.css',
    extensions: ['.css'],
    plugins: [],
    minimize: true,
  }),
  ...pluginsAfterPostCSS,
]

const defaultOutputData = pkg.buildFormats.map(({ file, format }) => ({
  file,
  format,
  plugins: [...plugins, filesize()],
}))

// this step is just to build the minified css and es modules javascript
const minifiedOutputData = pkg.buildFormats.map(({ file, format }) => ({
  file: file.replace('.js', '.min.js'),
  format,
  plugins: [...pluginsForCSSMinification, terser(), filesize()],
}))

const outputData = [...minifiedOutputData, ...defaultOutputData]

const config = outputData.map(({ file, format, plugins: specificPLugins }) => ({
  input,
  output: {
    file,
    format,
    name,
    globals,
  },
  external,
  plugins: specificPLugins,
}))

export default config
