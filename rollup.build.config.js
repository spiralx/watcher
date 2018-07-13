import typescript from 'rollup-plugin-typescript2'

import { COMMON_BUILD_OPTIONS, BUILD_OUTPUT_TARGETS } from './config/build-config'

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  output: BUILD_OUTPUT_TARGETS,

  plugins: [
    typescript()
  ],

  ...COMMON_BUILD_OPTIONS
}
