/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';

import WebpackAssetsManifest from 'webpack-assets-manifest';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

import config from 'config';
import { build } from '../package.json';
import parts from './webpack.config.parts';
import env from '../lib/env';

let webpackConfig = {
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.resolve(env.PATHS.app, 'assets', 'images', 'favicon.png'),
      prefix: 'icons-[hash]/',
      emitStats: false,
      title: env.PRODUCT.name,
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

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackInlineSourcePlugin(),

    new webpack.HotModuleReplacementPlugin()
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
  parts.template(path.resolve(env.PATHS.template, 'index-web.ejs'), env.PRODUCT.name)
);
