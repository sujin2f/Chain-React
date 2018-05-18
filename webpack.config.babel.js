/* eslint-disable */

switch (process.env.npm_lifecycle_event) {
  case 'start':
    module.exports = require('./webpack-config/webpack.config.dev.web').default;
    break;

  case 'ssr:dev':
  case 'ssr:build':
    module.exports = require('./webpack-config/webpack.config.production.ssr').default;
    break;

  case 'run:stats':
    module.exports = require('./webpack-config/webpack.config.stats').default;
}
