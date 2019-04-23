'use strict'

const path = require('path')

module.exports = {
  entry: './src/log.js',
  output: {
    libraryTarget: 'var',
    library: 'Log',
    filename: 'ipfslog.min.js'
  },
  target: 'web',
  devtool: 'sourcemap',
  node: {
    console: false,
    Buffer: true
  },
  plugins: [
  ],
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
