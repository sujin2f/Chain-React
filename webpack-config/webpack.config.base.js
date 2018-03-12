/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import config from 'config';
import path from 'path';

import parts from './webpack.config.parts';
import env from '../lib/env';

const baseConfig = {
  devtool: 'inline-source-map',

  cache: true,

  entry: [
    path.resolve(env.PATHS.app, 'assets', 'styles', 'app.scss'),
    path.resolve(env.PATHS.src, 'app.js'),
  ],

  output: {
    path: env.PATHS.build,
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      env.PATHS.app,
      env.PATHS.src,
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        include: [
          env.PATHS.app,
          env.PATHS.src,
        ],
      },
      {
        test: /\.(jsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        include: [
          env.PATHS.app,
          env.PATHS.src
        ],
      }
    ]
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: env.MODE
    }),

    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env.MODE),
        'CHAIN_REACT_BASE_URL': config.has('process.env.CHAIN_REACT_BASE_URL')
          ? JSON.stringify(config.get('process.env.CHAIN_REACT_BASE_URL'))
          : JSON.stringify("")
      }
    }),
  ],

  node: {
    __dirname: false,
    __filename: false
  },
};

export default merge.smart(
  baseConfig,
  parts.setupCSS([env.PATHS.app, env.PATHS.src]),
  parts.setupFonts([env.PATHS.app, env.PATHS.src]),
  parts.setupImages([env.PATHS.app, env.PATHS.src])
);
