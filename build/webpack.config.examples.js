/**
 * Created by hamupp on 2018/01/26.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('../config')
const uglify = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HOST = process.env.HOST;
console.log('HOST', HOST);
console.log('config.dev.host', config.dev.host);
module.exports = {
  devtool: 'source-map',
  entry: './examples/main',
  output: {
    path: path.join(__dirname, '../examples/dist'),
    publicPath: '',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    host: HOST || config.dev.host,

  },
  module: {
    // noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'less-loader'}
        ]
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel-loader'
      },
      // 加载json文件
      {
        test: /\.json$/,
        use: ['json-loader'],
      },
      {
        test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
        loader: 'url-loader',
        query: {
          limit: 30000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      // filename: path.join(__dirname, '../examples/dist/index.html'),
      template: path.join(__dirname, '../examples/index.html')
    }),
  ]
};
