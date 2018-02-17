import typescript from 'rollup-plugin-typescript2'

// --------------------------------------------------------------------

const pkg = require('./package.json')

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  plugins: [
    typescript()
  ],

  output: [
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true
    },

    {
      format: 'es',
      file: pkg.module,
      sourcemap: true
    },

    {
      format: 'umd',
      file: pkg.browser,
      name: 'Watcher',
      sourcemap: 'inline'
    }
  ]
}
