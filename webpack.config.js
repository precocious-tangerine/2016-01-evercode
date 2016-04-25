var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'client/app/app.js')
  ],
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      text: /(\.js|\.html)$/,
      loader: 'source-map-loader'
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.html$/,
      loader: 'raw'
    }]
  }
};
