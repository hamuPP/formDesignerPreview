/**
 * Created by hamupp 879372858@qq.com on 2018/01/26.
 */
const path = require("path");
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    devtool: 'source-map',
    entry: "./src/formPreview.js",
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: 'FormPreview.min.js',
        libraryTarget: 'umd',
        library: 'FormPreview',
        umdNamedDefine: true
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      // alias: {
      //   'vue$': 'vue/dist/vue.esm.js',
      //   '@': resolve('src'),
      // }
    },
    module: {
        // noParse: /es6-promise\.js$/,
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // {
            //     test: /\.less$/,
            //     use: [
            //         { loader: "style-loader" },
            //         { loader: "css-loader" },
            //         { loader: "less-loader" }
            //     ]
            // },
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
                // exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                exclude: /node_modules(?!(\/element-ui\/lib\/mixiins\/locale\/))/,
                loader: 'babel-loader',
              // include的写法示例
                include: [
                  resolve('src'),
                  // resolve('test'),
                  // resolve('node_modules/webpack-dev-server/client'),
                  //   resolve('src/api/axios.js.js'),
                  //    resolve('src/api/formDesigner_api.js'),
                  //   resolve('node_modules/element-ui/lib/mixins/locale'),
                ]
            },
          {
              test: /\.(png|jpg|gif|ttf|svg|woff|woff2|eot)$/,
              loader: 'url-loader',
          },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new uglify(
            {
                uglifyOptions: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_console: false,
                        drop_debugger: true
                    },
                }
            }
        ),
      // 开启 BundleAnalyzerPlugin
      // new BundleAnalyzerPlugin(),
    ]
};
