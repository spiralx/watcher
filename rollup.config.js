import typescript from 'rollup-plugin-typescript2'
import browsersync from 'rollup-plugin-browsersync'

import { COMMON_BUILD_OPTIONS, BUILD_OUTPUT_TARGETS, getBrowserSyncConfig } from './config/build-config'

// --------------------------------------------------------------------

const config = {
  input: 'src/index.ts',

  output: BUILD_OUTPUT_TARGETS,

  plugins: [
    typescript(),

    browsersync(getBrowserSyncConfig(9000, 'demo'))

    // browsersync(getBrowserSyncConfig(9000, 'demo', 'dist/watcher.umd.js')),
    // browsersync(getBrowserSyncConfig(9090, 'test', 'dist/watcher.umd.js'))
  ],

  ...COMMON_BUILD_OPTIONS
}

console.dir(config)

export default config
