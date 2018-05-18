/* eslint-disable */
import webpack from 'webpack';
import config from 'config';
import path from 'path';

import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

const dev = process.env.NODE_ENV !== "production";

const baseConfig = {
  mode: dev ? 'development' : 'production',

  devtool: dev ? 'none' : 'inline-source-map',

  cache: true,

  output: {
    path: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
    filename: '[name].bundle.js'
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'CHAIN_REACT_BASE_URL': config.has('process.env.CHAIN_REACT_BASE_URL')
          ? JSON.stringify(config.get('process.env.CHAIN_REACT_BASE_URL'))
          : JSON.stringify("")
      }
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};

export default baseConfig;
