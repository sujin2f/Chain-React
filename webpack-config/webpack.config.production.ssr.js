/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';

import WebpackAssetsManifest from 'webpack-assets-manifest';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

const dev = process.env.NODE_ENV !== "production";

import config from 'config';
import parts from './webpack.config.parts';

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'ssr'),
];

let webpackConfig = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'none' : 'inline-source-map',
  context: destinations[1],
  output: {
      path: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
      filename: "[name].bundle.js",
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        minify: true,
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      sortManifest: false
    }),
  ],
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  }
};

export default merge.smart(
  webpackConfig,
  parts.setupEntries({
    app: path.resolve(destinations[1], 'client', 'index.js'),
    style: path.resolve(destinations[0], 'assets', 'styles', 'app.scss'),
  }),
  parts.setupResolves({
    app: destinations[0],
    src: destinations[1],
  }),
  parts.setupLint(destinations),
  parts.setupBabel(destinations),
  parts.setupCSS(destinations),
  parts.setupFonts(destinations),
  parts.setupImages(destinations)
);