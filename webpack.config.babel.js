/* eslint-disable */
import merge from 'webpack-merge';

import baseConfig from './webpack-config/webpack.config.base';

let additionalConfig;

switch (process.env.npm_lifecycle_event) {
  case 'start':
    additionalConfig = require('./webpack-config/webpack.config.dev.web');

    module.exports = merge.smart(
      baseConfig,
      additionalConfig.default
    );
    break;

  case 'ssr:dev':
  case 'ssr:build':
    additionalConfig = require('./webpack-config/webpack.config.production.ssr');

    module.exports = merge.smart(
      additionalConfig.default
    );
    break;

  case 'stats':
  case 'bundle-size-analyzer':
    additionalConfig = require('./webpack-config/webpack.config.stats');

    module.exports = merge.smart(
      baseConfig,
      additionalConfig.default
    );
}
