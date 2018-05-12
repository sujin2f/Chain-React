/* eslint-disable */
import webpack from 'webpack';
import merge from 'webpack-merge';
import config from 'config';
import path from 'path';

// import env from '../lib/env';

const baseConfig = {
  devtool: 'inline-source-map',
  cache: true,

  output: {
    path: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
    filename: '[name].js'
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
      NODE_ENV: process.env.NODE_ENV
    }),

    new webpack.DefinePlugin({
      'process.env': {
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

/*
export default merge.smart(
  baseConfig,
  parts.setupCSS(destinations),
  parts.setupFonts(destinations),
  parts.setupImages(destinations)
);
*/

export default baseConfig;
