import copy from 'rollup-plugin-copy'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

// --------------------------------------------------------------------

const pkg = require('./package.json')

// --------------------------------------------------------------------

export default {
  input: 'src/index.ts',

  plugins: [
    copy({
      'node_modules/bootstrap/dist': 'demo/vendor/bootstrap',
      'node_modules/bootstrap-treeview/public/css': 'demo/vendor/bootstrap-treeview/css',
      'node_modules/bootstrap-treeview/public/js': 'demo/vendor/bootstrap-treeview/js',
      'dist/watcher.umd.js': 'demo/js/watcher.js',
      verbose: true
    }),
    serve('demo'),
    livereload('demo')
  ],

  output: []
}
