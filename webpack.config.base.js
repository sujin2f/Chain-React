/* eslint-disable */
import webpack from 'webpack';
import config from 'config';

export default {
  cache: true,

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'CHAIN_REACT_BASE_URL': config.has('process.env.CHAIN_REACT_BASE_URL')
          ? JSON.stringify(config.get('process.env.CHAIN_REACT_BASE_URL'))
          : JSON.stringify("")
      }
    }),
  ],
};
