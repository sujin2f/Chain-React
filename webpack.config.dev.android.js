import WebpackAssetsManifest from 'webpack-assets-manifest';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

import { build } from './package.json';
import parts from './webpack.config.parts';
const ENV = require('./env');

const PATHS = {
  app: path.join(__dirname, 'app'),
  src: path.join(__dirname, 'src/common'),
  build: path.resolve(__dirname, build.paths.output),
  template: path.resolve(__dirname, './templates'),
};

process.env.BABEL_ENV = ENV;

let webpackConfig = {
  entry: [
    path.resolve(PATHS.app, 'assets', 'styles', 'app.scss'),
    path.resolve(PATHS.src, 'app.js'),
  ],
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        include: [
          PATHS.app,
          PATHS.src,
        ],
      },
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        include: [
          PATHS.app,
          PATHS.src
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      PATHS.app,
      PATHS.src,
      'node_modules',
    ],
  },
  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
      sortManifest: false
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackInlineSourcePlugin(),

    new webpack.HotModuleReplacementPlugin()
  ],
};

export default merge.smart(
  webpackConfig,
  parts.setupCSS([PATHS.app, PATHS.src]),
  parts.setupFonts([PATHS.app, PATHS.src]),
  parts.setupImages([PATHS.app, PATHS.src]),
  parts.devServer({
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
    contentBase: PATHS.build,
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.template(path.resolve(PATHS.template, 'index-android.ejs'), build.productName)
);
