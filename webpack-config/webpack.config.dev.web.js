/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';

import WebpackAssetsManifest from 'webpack-assets-manifest';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import config from 'config';
import parts from './webpack.config.parts';

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'web'),
];

let webpackConfig = {
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.resolve(destinations[0], 'assets', 'images', 'favicon.png'),
      prefix: 'icons-[hash]/',
      emitStats: false,
      title: process.env.npm_package_config_productName,
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

    new webpack.HotModuleReplacementPlugin(),

    new CopyWebpackPlugin(['static'])
  ],
};

export default merge.smart(
  webpackConfig,
  parts.setupEntries([
    path.resolve(destinations[0], 'assets', 'styles', 'app.scss'),
    path.resolve(destinations[1], 'app.js'),
  ]),
  parts.setupResolves({
    app: destinations[0],
    src: destinations[1],
  }),
  parts.setupLint(destinations),
  parts.setupBabel(destinations),
  parts.setupDevServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
    proxy: config.has('webpack-dev-server.proxy') ? config.get('webpack-dev-server.proxy') : undefined
  }),
  parts.setupTemplate(
    path.resolve(process.env.npm_package_config_paths_templates, 'index-web.ejs'),
    process.env.npm_package_config_productName,
    'index.html',
    path.resolve(process.env.npm_package_config_paths_app, 'assets', 'images', 'favicon.png')
  ),
  parts.setupCSS(destinations),
  parts.setupFonts(destinations),
  parts.setupImages(destinations)
);
