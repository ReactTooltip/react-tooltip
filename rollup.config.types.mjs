import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'

export default {
  input: './src/index.tsx',
  output: [{ file: 'dist/react-tooltip.d.ts', format: 'es' }],
  plugins: [
    postcss({
      extract: 'react-tooltip-tokens.css', // this will generate a specific file not being used, but we need this part of code
      autoModules: true,
      include: '**/*.css',
      extensions: ['.css'],
      plugins: [],
    }),
    dts({
      compilerOptions: {
        baseUrl: 'src',
      },
    }),
  ],
}
