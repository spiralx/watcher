import typescript from 'rollup-plugin-typescript2'
import browsersync from 'rollup-plugin-browsersync'

import { COMMON_BUILD_OPTIONS, getBrowserSyncConfig } from './config/build-config'

// --------------------------------------------------------------------

export default {
  input: 'src/utils/el.ts',

  output: {
    format: 'iife',
    file: 'dist/el.js',
    name: 'EL'
  },

  plugins: [
    typescript({
      compilerOptions: {
        declaration: false
      }
    }),

    browsersync(getBrowserSyncConfig(9090, 'test', 'dist/watcher.umd.js', 'dist/el.js'))
  ],

  ...COMMON_BUILD_OPTIONS
}
