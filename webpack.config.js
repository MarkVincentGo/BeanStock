const path = require('path');
const srcDir = path.join(__dirname, 'client');
//const distDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'django_server/stock_app/stocks/static/stocks');

module.exports = {
  entry: path.join(srcDir, 'index.tsx'),
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  output: {
    path: distDir,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
