import typescript from 'rollup-plugin-typescript2'
import browsersync from 'rollup-plugin-browsersync'

// --------------------------------------------------------------------

export default {
  input: 'src/utils/el.ts',

  output: {
    format: 'iife',
    file: 'dist/el/el.js',
    name: 'EL'
  },

  plugins: [
    typescript({
      compilerOptions: {
        declaration: false
      }
    }),
    browsersync({
      server: [
        'test',
        'dist'
      ],
      files: [
        'test/index.html',
        'test/tests.js',
        'dist/watcher.js',
        'dist/el/el.js'
      ],
      port: 9090
    })
  ],

  watch: {
    clearScreen: false
  }
}
