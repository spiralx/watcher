import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import execute from 'rollup-plugin-execute'
import browsersync from 'rollup-plugin-browsersync'

// --------------------------------------------------------------------

export default {
  input: 'src/vendor.js',

  output: {
    file: 'dist/vendor.js',
    format: 'iife',
    name: 'self',
    extend: true,
    sourcemap: 'inline',
    // globals: {
    //   jquery: '$',
    //   lodash: '_'
    // }
  },

  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),

    execute('cp dist/vendor.js demo/js'),
    browsersync({
      server: 'demo',
      startPath: '/vendor-test.html',
      files: [
        'demo/vendor-demo.html',
        'demo/css/*.css',
        'dist/js/vendor.js'
      ],
      port: 9001
    })
  ]
}
