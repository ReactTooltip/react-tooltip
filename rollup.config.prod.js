import analyze from 'rollup-plugin-analyzer'
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

const external = ['react', 'react-dom', 'prop-types', 'classnames']

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  classnames: 'classNames',
  'prop-types': 'PropTypes',
}

const plugins = [
  progress(),
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
  terser(),
  analyze(),
  filesize(),
]

const outputData = [
  {
    file: pkg.browser,
    format: 'umd',
  },
  {
    file: pkg.main,
    format: 'cjs',
  },
  {
    file: pkg.module,
    format: 'es',
  },
]

const config = outputData.map(({ file, format }) => ({
  input,
  output: {
    file,
    format,
    name,
    globals,
  },
  external,
  plugins,
}))

export default config
