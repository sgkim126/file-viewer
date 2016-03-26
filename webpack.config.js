const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugs = [
  new ExtractTextPlugin('viewer.css')
];

module.exports = {
  output: {
    path: './build'
  },
  target: 'web',
  plugins: plugs,
  module: {
    loaders: [
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader') },
      { test: /\.ts[x]?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader' }
    ]
  }
}
