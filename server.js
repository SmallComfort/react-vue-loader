const path = require('path')
const webpack = require('webpack')

const webpackConfig = {
  context: path.resolve(__dirname, 'dev'),
  entry: {
    // 'build-react': './react.jsx',
    'build-vue': './vue.md'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev/dist')
  },
  module: {
    rules: [{
      test: /\.(vue|md)$/,
      loader: 'index',
      options: {
        output: '',
        vue: './index.js'
      }
    }]
  },
  resolveLoader: {
    modules: [__dirname, 'node_modules']
  }
}

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
})
