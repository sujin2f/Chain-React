/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';
import config from 'config';

import parts from './webpack.config.parts';

// import WebpackAssetsManifest from 'webpack-assets-manifest';
// import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
// import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

/*
import { build } from '../package.json';
import env from '../lib/env';
*/

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../',process.env.npm_package_config_paths_src, 'web'),
];

let webpackConfig = {
  mode: 'development',

  entry: [
    path.resolve(__dirname, '../', process.env.npm_package_config_paths_app, 'assets', 'styles', 'app.scss'),
    path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'web', 'app.js'),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
      path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'web'),
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        enforce: "pre",
        use: [{
          loader: 'eslint-loader',
        }],
        include: destinations,
      },
      {
        test: /\.(jsx?)$/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }],
        include: destinations,
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
/*
    new WebpackAssetsManifest({
      writeToDisk: true,
      sortManifest: false
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackInlineSourcePlugin(),

*/
  ],
};

export default merge.smart(
  webpackConfig,
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
    proxy: config.has('webpack-dev-server.proxy') ? config.get('webpack-dev-server.proxy') : undefined
  }),
  parts.template(
    path.resolve(process.env.npm_package_config_paths_templates, 'index-web.ejs'),
    process.env.npm_package_config_productName,
    'index.html',
    path.resolve(process.env.npm_package_config_paths_app, 'assets', 'images', 'favicon.png')
  ),
  parts.setupCSS(destinations)
);
