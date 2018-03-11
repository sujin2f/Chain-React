/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';

import WebpackAssetsManifest from 'webpack-assets-manifest';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

import config from 'config';
import { build } from './package.json';
import parts from './webpack.config.parts';

const PATHS = {
  app: path.resolve(__dirname, './app'),
  src: path.resolve(__dirname, './src/common'),
  build: path.resolve(__dirname, build.paths.output),
  template: path.resolve(__dirname, './templates'),
};

let webpackConfig = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        exclude: /node_modules/,
        include: [
          PATHS.app,
          PATHS.src
        ],
      },
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
    ]
  },
  entry: {
    style: path.resolve(PATHS.app, 'assets', 'styles', 'app.scss'),
    app: path.resolve(PATHS.src, 'app.js'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      PATHS.app,
      PATHS.src,
      'node_modules',
    ],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.resolve(PATHS.app, 'assets', 'images', 'favicon.png'),
      prefix: 'icons-[hash]/',
      emitStats: false,
      title: build.productName,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: true,
        twitter: true,
        yandex: false,
        windows: false
      },
    }),
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
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
    proxy: config.has('webpack-dev-server.proxy') ? config.get('webpack-dev-server.proxy') : undefined
  }),
  parts.template(path.resolve(PATHS.template, 'index-web.ejs'), build.productName)
);
