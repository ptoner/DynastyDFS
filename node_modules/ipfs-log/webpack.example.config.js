'use strict'

const path = require('path')

module.exports = {
  entry: './examples/browser/index.js',
  output: {
    filename: '../examples/browser/bundle.js'
  },
  target: 'web',
  devtool: 'none',
  node: {
    console: false,
    process: 'mock',
    Buffer: true
  },
  plugins: [
  ],
  externals: {
    fs: '{}'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ]
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    moduleExtensions: ['-loader']
  }
}
