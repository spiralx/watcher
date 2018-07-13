
require('colors')

// --------------------------------------------------------

const pkg = require('./package.json')

export const COMMON_BUILD_OPTIONS = {
  onwarn: warning => {
    const loc = warning.loc
      ? ` ${warning.loc.file} (${warning.loc.line}:${warning.loc.column}`
      : ``

    console.warn(`WARNING‼ `.red + warning.code.magenta.bold + `${loc} : ${warning.message.cyan.bold}`)
    console.dir(warning)
  },

  watch: {
    clearScreen: false
  }
}

// --------------------------------------------------------------------

export const BUILD_OUTPUT_TARGETS = [
  // {
  //   format: 'iife',
  //   file: pkg.browser,
  //   name: 'Watcher',
  //   sourcemap: 'inline'
  // },

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
]

// --------------------------------------------------------

export const getBrowserSyncConfig = (port, directory, ...files) => {
  const config = {
    port,
    server: [
      'dist',
      directory
    ],
    files: [
      `dist/watcher.umd.js`,
      `${directory}/**/*.*`,
      ...files
    ],
    watchOptions: {
      debounceDelay: 2000
    }
  }

  console.group(`getBrowserSyncConfig(port: ${port}, dir: "${directory}"): files, config`)
  console.dir(files)
  console.dir(config)
  console.groupEnd()

  return config
}
