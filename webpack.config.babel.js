/* eslint-disable */
import merge from 'webpack-merge';

import baseConfig from './webpack-config/webpack.config.base';

import env from './lib/env';

let additionalConfig;

switch (env.TARGET) {
  case 'prepare':
  case 'dev:android':
  case 'dev:ios':
  case 'emulator:android':
  case 'emulator:ios':
    additionalConfig = require('./webpack-config/webpack.config.dev.cordova');
    break;

  case 'start-electron-dev':
    additionalConfig = require('./webpack-config/webpack.config.dev.electron');
    break;

  case 'build-electron-dll':
    additionalConfig = require('./webpack-config/webpack.config.dev.electron.dll');
    break;

  default:
    additionalConfig = require('./webpack-config/webpack.config.dev.web');
    break;
}

module.exports = merge.smart(
  baseConfig,
  additionalConfig.default
);
