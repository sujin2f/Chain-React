/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';

import WebpackAssetsManifest from 'webpack-assets-manifest';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import config from 'config';
import parts from './webpack.config.parts';

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'ssr'),
];

let webpackConfig = {
  plugins: [
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
  parts.setupEntries(path.resolve(destinations[1], 'client', 'index.js')),
  parts.setupResolves({
    app: destinations[0],
    src: destinations[1],
  }),
  parts.setupLint(destinations),
  parts.setupBabel(destinations)
);
