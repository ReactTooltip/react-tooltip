import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'

export default {
  input: './src/index.tsx',
  output: [{ file: 'dist/react-tooltip.d.ts', format: 'es' }],
  plugins: [
    postcss({
      extract: 'react-tooltip-tokens.css', // this will generate a specific file and override on multiples build, but the css will be the same
      autoModules: true,
      include: '**/*.css',
      extensions: ['.css'],
      plugins: [],
    }),
    dts(),
  ],
}
