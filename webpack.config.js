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
  devtool: 'source-map',
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
          plugins: ['transform-class-properties'],
        },
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'url-loader',
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
