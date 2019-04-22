const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    'service-worker': './src/service-worker.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
