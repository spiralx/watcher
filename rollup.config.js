import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import browsersync from 'rollup-plugin-browsersync'

import readPkg from 'read-pkg'

// --------------------------------------------------------------------

const pkg = readPkg.sync()

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  plugins: [
    typescript(),
    copy({
      'dist/watcher.umd.js': 'demo/js/watcher.js',
      verbose: true
    }),
    browsersync({
      server: 'demo'
    })
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
