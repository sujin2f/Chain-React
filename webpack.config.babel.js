/* eslint-disable */
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';
import devWebConfig from './webpack.config.dev.web';
import devAndroidConfig from './webpack.config.dev.android';
import devElectronConfig from './webpack.config.dev.electron';

const TARGET = process.env.npm_lifecycle_event;
let webpackConfig;

console.log(TARGET);

switch (TARGET) {
  case 'prepare':
  case 'dev:cordova':
  case 'emulator:android':
  case 'emulator:ios':
    webpackConfig = merge.smart(
      baseConfig,
      devAndroidConfig
    );
    break;

  case 'dev:election':
    webpackConfig = merge.smart(
      baseConfig,
      devElectronConfig
    );
    break;

  default:
    webpackConfig = merge.smart(
      baseConfig,
      devWebConfig
    );
}

console.log(TARGET);

module.exports = webpackConfig;
