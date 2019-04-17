'use strict'

const glob = require('glob')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // TODO: put all tests in a .js file that webpack can use as entry point
  entry: glob.sync('./test/*.spec.js', { 'ignore': ['./test/replicate.spec.js'] }),
  output: {
    filename: '../test/browser/bundle.js'
  },
  target: 'web',
  devtool: 'source-map',
  node: {
    console: false,
    process: 'mock',
    Buffer: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  externals: {
    fs: '{}',
    rimraf: '{ sync: () => {} }',
    'idb-readable-stream': '{}'
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
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }]
            ],
            plugins: ['@babel/syntax-object-rest-spread', '@babel/transform-runtime', '@babel/plugin-transform-modules-commonjs']
          }
        }
      },
      // For inlining the fixture keys in browsers tests
      {
        test: /userA|userB|userC|userD|042750228c5d81653e5142e6a56d5551231649160f77b25797dc427f8a5b2afd650acca10182f0dfc519dc6d6e5216b9a6612dbfc56e906bdbf34ea373c92b30d7|045d10320c2a75982d55e7e487db235341ac0a09a36252de6f3e959b9e249841a4bf4cfb909ec8c801ceeb0679586312e1830a753800ee351da54eb20e401df592|04b69f2e4c69b7e1e981e423130a50eae1a3f6f3b4ba17e221f676c336ea318be05b782642ac981efc66532cf583a9a40d72d5c2c458c80df9709bc787599fce55|04e9224ee3451772f3ad43068313dc5bdc6d3f2c9a8c3a6ba6f73a472d5f47a96ae6d776de13f2fc2076140fd68ca900df2ca4862b06192adbf8f8cb18a99d69aa$/,
        loader: 'json-loader'
      }
    ]
  }
}
