/* eslint-disable */
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';
import devWebConfig from './webpack.config.dev.web';
import devAndroidConfig from './webpack.config.dev.android';

const TARGET = process.env.npm_lifecycle_event;
let webpackConfig;

switch (TARGET) {
  case 'dev:android':
    webpackConfig = devAndroidConfig;
    break;

  default:
    webpackConfig = merge.smart(
      baseConfig,
      devWebConfig
    );
}

// console.log(webpackConfig);

module.exports = webpackConfig;
