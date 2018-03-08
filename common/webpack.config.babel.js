/* eslint-disable */

// This webpack.config.js file was built based on the examples provided here: http://survivejs.com/webpack/
import webpack from 'webpack';

// Node Utilities
import path from 'path';

import config from 'config';

// Webpack Plugins
import WebpackAssetsManifest from 'webpack-assets-manifest';

import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

// External Webpack Utilities
import merge from 'webpack-merge';

import validate, { Joi } from 'webpack-validator';

// Webpack loader configurations
import parts from './libs/parts';

import info from '../info';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PATHS = {
  app: path.resolve(__dirname, 'app'),
  src: path.resolve(__dirname, 'src'),
  build: {
    web: path.resolve(__dirname, 'build'),
    android: path.resolve(__dirname, '../cordova-android/app/src/main/assets/www'),
    phonegap: path.resolve(__dirname, '../phonegap/www'),
  },
  template: path.resolve(__dirname, 'templates'),
};

// If '--json' is passed with the Webpack CLI call
// we set a boolean used for suppressing console output
const withJSON = function() {
  const index = process.argv.findIndex(function(e, i, arr) {
    return (e === '--json');
  });

  return (-1 !== index);
};

const TARGET = process.env.BABEL_ENV = process.env.npm_lifecycle_event;

console.log(config.has('process.env.CHAIN_REACT_BASE_URL'));
console.log(config.get('process.env.CHAIN_REACT_BASE_URL'));

let common = {
  entry: {
    style: path.resolve(PATHS.app, 'assets', 'styles', 'app.scss'),
    app: path.resolve(PATHS.src, 'app.js'),
  },
  output: {
    path: PATHS.build.android,
    filename: '[name].js',
  },
  resolve: {
    root: [
      path.resolve(PATHS.app),
      path.resolve(PATHS.src),
    ],
    // Do not remove ''. If you do, imports without an extension won't work anymore
    extensions: [ '', '.js', '.jsx' ],
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: [ 'eslint' ],
        include: [
          PATHS.app,
          PATHS.src,
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'CHAIN_REACT_BASE_URL': config.has('process.env.CHAIN_REACT_BASE_URL')
          ? JSON.stringify(config.get('process.env.CHAIN_REACT_BASE_URL'))
          : JSON.stringify("")
      }
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(PATHS.app, 'assets', 'images', 'favicon.png'),
      prefix: 'icons-[hash]/',
      emitStats: false,
      title: info.title,
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
    })
  ],
};

let webpackConfig;

// Detect how npm is run and branch based on that
switch (TARGET) {
  case 'stats':
  case 'build':
  case 'build:android':
    webpackConfig = merge.smart(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build.android,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(path.join(PATHS.build.android, '*')),
      parts.extractBundle({
        name: 'vendor',
        entries: [ 'react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-redux' ],
      }),
      parts.babel([PATHS.app, PATHS.src]),
      // parts.uglifyjs_plugin(), // Uses the UglifyJSPlugin
      parts.uglifyjs_loader([PATHS.app, PATHS.src]), // Uses uglify-loader
      parts.extractCSS([PATHS.app, PATHS.src]),
      parts.purifyCSS([PATHS.app, PATHS.src]),
      parts.setupFonts([PATHS.app, PATHS.src]),
      parts.setupImages([PATHS.app, PATHS.src]),
      parts.template(path.resolve(PATHS.template, 'index-android.ejs'), info.title)
    );
    break;
  case 'build:phonegap':
    webpackConfig = merge.smart(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build.phonegap,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(path.join(PATHS.build.phonegap, '*')),
      parts.extractBundle({
        name: 'vendor',
        entries: [ 'react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-redux' ],
      }),
      parts.babel([PATHS.app, PATHS.src]),
      // parts.uglifyjs_plugin(), // Uses the UglifyJSPlugin
      parts.uglifyjs_loader([PATHS.app, PATHS.src]), // Uses uglify-loader
      parts.extractCSS([PATHS.app, PATHS.src]),
      parts.purifyCSS([PATHS.app, PATHS.src]),
      parts.setupFonts([PATHS.app, PATHS.src]),
      parts.setupImages([PATHS.app, PATHS.src]),
      parts.template(path.resolve(PATHS.template, 'index-phonegap.ejs'), info.title)
    );
    break;
  case 'build:web':
    webpackConfig = merge.smart(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build.web,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(path.join(PATHS.build.web, '*')),
      parts.extractBundle({
        name: 'vendor',
        entries: [ 'react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-redux' ],
      }),
      parts.babel([PATHS.app, PATHS.src]),
      // parts.uglifyjs_plugin(), // Uses the UglifyJSPlugin
      parts.uglifyjs_loader([PATHS.app, PATHS.src]), // Uses uglify-loader
      parts.extractCSS([PATHS.app, PATHS.src]),
      parts.purifyCSS([PATHS.app, PATHS.src]),
      parts.setupFonts([PATHS.app, PATHS.src]),
      parts.setupImages([PATHS.app, PATHS.src]),
      parts.template(path.resolve(PATHS.template, 'index-web.ejs'), info.title)
    );
    break;
  default:
    webpackConfig = merge.smart(
      common,
      {
        devtool: 'source-map',
        output: config.has('webpack.output') ? config.get('webpack.output') : {},
      },
      parts.babel([PATHS.app, PATHS.src]),
      parts.setupCSS([PATHS.app, PATHS.src]),
      parts.setupFonts([PATHS.app, PATHS.src]),
      parts.setupImages([PATHS.app, PATHS.src]),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
        proxy: config.has('webpack-dev-server.proxy') ? config.get('webpack-dev-server.proxy') : undefined
      }),
      parts.template(path.resolve(PATHS.template, 'index-web.ejs'), info.title)
    );
}


// This joi schema will be `Joi.concat`-ed with the internal schema
const webpackValidatorSchema = Joi.object({
  "eslint": Joi.any(),
  "uglify-loader": Joi.any(),
  "imageWebpackLoader": Joi.any()
});

module.exports = webpackConfig;
