module.exports = {
  output: {
    path: './build'
  },
  target: 'web',
  module: {
    loaders: [
      { test: /\.ts[x]?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader' }
    ]
  }
}
