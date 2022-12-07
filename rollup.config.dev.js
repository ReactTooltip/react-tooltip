// import analyze from 'rollup-plugin-analyzer'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import postcss from 'rollup-plugin-postcss'
import progress from 'rollup-plugin-progress'
import browsersync from 'rollup-plugin-browsersync'
import html from 'rollup-plugin-html-scaffold'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import typescript from 'typescript'

const input = ['src/index-dev.tsx']

const name = 'ReactTooltip'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  classnames: 'classNames',
  'prop-types': 'PropTypes',
}

const plugins = [
  progress(),
  html({
    input: './public/index.html',
    output: './build/index.html',
    template: { appBundle: 'index.js' },
  }),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  }),
  postcss({
    extract: true,
    autoModules: true,
    include: '**/*.css',
    extensions: ['.css'],
    plugins: [],
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
  // analyze(), // to check diff of file size when bundle
  filesize(),
  copy({
    // targets: [
    //   { src: 'src/assets', dest: 'build/' },
    //   { src: 'public/manifest.json', dest: 'build/' },
    //   { src: 'public/offline.html', dest: 'build/' },
    // ],
    targets: [{ src: 'dist/', dest: 'build/' }],
    verbose: true,
  }),
  browsersync({
    server: 'build',
    watch: true,
    ui: false,
    open: false,
    // port: 3000,
    // ui: {
    //   port: 3001,
    // },
  }),
]

export default {
  input,
  output: {
    file: 'build/index.js',
    format: 'umd',
    name,
    globals,
  },
  plugins,
}
