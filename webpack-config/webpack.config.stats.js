/* eslint-disable */
import merge from 'webpack-merge';
import path from 'path';

import parts from './webpack.config.parts';

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'ssr'),
];

export default merge.smart(
  parts.setupBase(),
  parts.setupMinimize(),
  parts.setupEntries({
    app: path.resolve(destinations[1], 'client', 'index.js'),
  }),
  parts.setupResolves({
    app: destinations[0],
    src: destinations[1],
  }),
  parts.setupLint(destinations),
  parts.setupBabel(destinations)
);
