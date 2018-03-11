const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const ENV = require('./env');
const PATHS = {
  app: path.join(__dirname, 'app'),
  src: path.join(__dirname, 'src/common'),
  build: path.join(__dirname, 'www'),
};

process.env.BABEL_ENV = ENV;

const common = {
  entry: PATHS.src,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        exclude: /node_modules/,
        include: [
          PATHS.app,
          PATHS.src
        ],
      },
      {
        test: /\.(js)$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        include: [
          PATHS.app,
          PATHS.src,
        ],
      },
    ]
  },
};

if (ENV === 'development') {
  module.exports = merge(common, {
    devServer: {
      disableHostCheck: true,
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
} else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {});
}
