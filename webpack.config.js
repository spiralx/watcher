const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

// ----------------------------------------------------------------------------

const _P = (...rel) => path.join(__dirname, ...rel)

const src = _P('src')
const dist = _P('dist')

// ----------------------------------------------------------------------------

module.exports = {

  watch: true,
  cache: true,
  devtool: '#cheap-module-eval-source-map',
  // debug: true,

  context: src,

  entry: {
    watcher: './index.ts'
  },

  output: {
    path: dist,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    library: 'Watcher',
    libraryTarget: 'var'
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['', '.ts', '.js', '.json']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.pug$/,
        loader: 'pug'
      }
    ]
  },
  //
  // externals: {
  //   Watcher: ''
  // }

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // new HtmlWebpackPlugin({
    //   chunks: [ 'demo' ],
    //   // filename: 'demo.html',
    //   title: 'watcher test',
    //   template: _P('demo/demo.pug')
    // })
  ],

  // ts: {
  //   //configFileName: P('./app/tsconfig.json')
  //   compilerOptions : {
  //     target: 'ES6',
  //     sourceMap: true,
  //     pretty: true,
  //     noImplicitAny: false,
  //     emitDecoratorMetadata: true,
  //     experimentalDecorators: true
  //   }
  // },

}
