import dts from 'rollup-plugin-dts'

export default {
  input: './build/index.d.ts',
  output: [{ file: 'build/index-builded.d.ts', format: 'es' }],
  plugins: [dts()],
}
