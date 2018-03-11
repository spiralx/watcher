import typescript from 'rollup-plugin-typescript2'

// --------------------------------------------------------------------

const pkg = require('./package.json')

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  output: [
    {
      format: 'umd',
      file: pkg.browser,
      name: 'Watcher',
      sourcemap: 'inline'
    },

    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true
    },

    {
      format: 'es',
      file: pkg.module,
      sourcemap: true
    }
  ],

  plugins: [
    typescript()
  ],

  watch: {
    clearScreen: false
  }
}
