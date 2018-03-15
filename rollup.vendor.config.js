import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import filesize from 'rollup-plugin-filesize'
import minify from 'rollup-plugin-minify-es'

import execute from 'rollup-plugin-execute'
import browsersync from 'rollup-plugin-browsersync'

// --------------------------------------------------------------------

export default {
  input: 'src/vendor.js',

  output: {
    file: 'dist/vendor.min.js',
    format: 'iife',
    name: 'vendor',
    sourcemap: true
  },

  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    filesize(),

    minify({
      mangle: false,
      keep_classnames: true
    }),

    execute('cp --remove-destination dist/vendor.* demo/js'),
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
