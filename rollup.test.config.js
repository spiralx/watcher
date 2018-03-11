import typescript from 'rollup-plugin-typescript2'

// --------------------------------------------------------------------

export default {
  input: 'src/utils/el.ts',

  output: {
    format: 'iife',
    file: 'test/el.js',
    name: 'EL'
  },

  plugins: [
    typescript()
  ]
}
