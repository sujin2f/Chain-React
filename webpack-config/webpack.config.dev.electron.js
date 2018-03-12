/* eslint global-require: 0, import/no-dynamic-require: 0 */

/**
 * Build config for development electron renderer process that uses
 * Hot-Module-Replacement
 *
 * https://webpack.js.org/concepts/hot-module-replacement/
 */

import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import merge from 'webpack-merge';
import { spawn, execSync } from 'child_process';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../lib/scripts/CheckNodeEnv';
import env from '../lib/env';

CheckNodeEnv('development');

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dll = path.resolve(process.cwd(), 'dll');

console.log('dll: ' + dll);

const manifest = path.resolve(dll, 'renderer.json');

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(dll) && fs.existsSync(manifest))) {
  console.log(chalk.black.bgYellow.bold('The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'));
  execSync('npm run build-electron-dll');
}

const webpackConfig = {
  target: 'electron-renderer',

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
  ],

  output: {
    path: env.PATHS.src,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
    publicPath: `http://localhost:${port}/dist/`,
    filename: 'renderer.dev.js'
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var',
    }),

    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new ExtractTextPlugin({
      filename: '[name].css'
    }),
  ],

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: env.PATHS.build,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before() {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...');
        spawn(
          'npm',
          ['run', 'start-electron-main-dev'],
          { shell: true, env: process.env, stdio: 'inherit' }
        )
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      }
    }
  },
};

export default webpackConfig;
