import typescript from 'rollup-plugin-typescript2'
// import copy from 'rollup-plugin-copy'
import execute from 'rollup-plugin-execute'
import browsersync from 'rollup-plugin-browsersync'

import colors from 'colors' // eslint-disable-line no-unused-vars

// --------------------------------------------------------------------

const pkg = require('./package.json')

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  output: [
    {
      format: 'iife',
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
    //   'dist/watcher.js': 'demo/js/watcher.js'
    // }),
    execute('cp dist/watcher.js demo/js'),
    browsersync({
      server: 'demo',
      files: [
        'demo/index.html',
        'demo/css/*.css',
        'demo/js/*.js'
      ]
    })
  ],

  onwarn: warning => {
    const loc = warning.loc
      ? ` ${warning.loc.file} (${warning.loc.line}:${warning.loc.column}`
      : ``

    console.warn(`WARNING‼ `.red + warning.code.magenta.bold + `${loc} : ${warning.message.cyan.bold}`)
    console.dir(warning)
    // if (Object.keys(data).length) {
    //   console.dir(data)
    // }
  },

  watch: {
    clearScreen: false
  }
}
