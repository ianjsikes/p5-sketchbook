const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
  entry: path.resolve('./src/index.js'),
  outDir: path.resolve('./build'),
  html: path.resolve('./src/index.html'),
}

module.exports = {
  entry: paths.entry,

  devServer: {
    contentBase: paths.outDir,
  },

  output: {
    filename: '[name].bundle.js',
    path: paths.outDir,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          presets: ['es2015'],
        },
      },
    ],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: paths.html,
    }),
  ],
}
