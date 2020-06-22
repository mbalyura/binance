// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    '@babel/polyfill',
    `${__dirname}/src/index.js`,
  ],
  output: {
    path: `${__dirname}/dist/public`,
    // publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: `${__dirname}/src/index.js`,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    // }),
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
};
