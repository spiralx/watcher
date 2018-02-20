import typescript from 'rollup-plugin-typescript2'
// import copy from 'rollup-plugin-copy'
import execute from 'rollup-plugin-execute'
import browsersync from 'rollup-plugin-browsersync'

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
    typescript(),
    // copy({
    //   'dist/watcher.umd.js': 'demo/js/watcher.js'
    // }),
    execute('cp dist/watcher.umd.js demo/watcher.js'),
    browsersync({
      server: 'demo',
      files: [
        'demo/index.html',
        'demo/css/*.css',
        'demo/js/*.js'
      ]
    })
  ],

  watch: {
    clearScreen: false
  }
}
