
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ngRedux Async',
      template: './client/index.html',
      inject: 'body'
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: ['babel'],
      exclude: /node_modules/,
    },
    {
      test: /\.html$/,
      loader: 'html'
    }]
  }
};