/**
 * Builds the DLL for development electron renderer process
 */

import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';
import { dependencies } from '../package.json';
import CheckNodeEnv from '../lib/scripts/CheckNodeEnv';
import env from '../lib/env';

CheckNodeEnv('development');

const dist = path.resolve(process.cwd(), 'dll');

export default merge.smart(baseConfig, {
  context: process.cwd(),

  devtool: 'eval',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify'],

  entry: {
    renderer: (
      Object
        .keys(dependencies || {})
        .filter(dependency => dependency !== 'font-awesome')
    )
  },

  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: env.PATHS.src,
        output: {
          path: path.resolve(process.cwd(), 'dll'),
        },
      },
    })

    new webpack.NamedModulesPlugin(),
  ],
});
