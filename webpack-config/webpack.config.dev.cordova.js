import WebpackAssetsManifest from 'webpack-assets-manifest';
// import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

import { build } from '../package.json';
import parts from './webpack.config.parts';
const env = require('../lib/env');

let webpackConfig = {
  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
      sortManifest: false
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

//     new HtmlWebpackInlineSourcePlugin(),

    new webpack.HotModuleReplacementPlugin()
  ],
};

export default merge.smart(
  webpackConfig,
  parts.devServer({
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
    contentBase: env.PATHS.build,
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.template(path.resolve(env.PATHS.template, 'index-android.ejs'), env.PRODUCT.name)
);
