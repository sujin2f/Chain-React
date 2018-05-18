/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import config from 'config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CompressionPlugin from 'compression-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const dev = process.env.NODE_ENV !== "production";

exports.setupBase = function() {
  return {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'none' : 'inline-source-map',
    cache: !dev,
    output: {
      path: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
      filename: '[name].[hash].js',
      chunkFilename: '[id].js',
    },
    plugins: [
      new CleanWebpackPlugin(
        path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
        {
          root: path.resolve(__dirname, '../'),
        }
      ),
      new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
      }),
        new webpack.DefinePlugin({
        'process.env': {
          'CHAIN_REACT_BASE_URL': config.has('process.env.CHAIN_REACT_BASE_URL')
            ? JSON.stringify(config.get('process.env.CHAIN_REACT_BASE_URL'))
            : JSON.stringify("")
        }
      }),
    ],
  }
};

exports.setupMinimize = function() {
  return {
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionPlugin({
          asset: '[path].gz[query]',
          minify: true,
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
          threshold: 10240,
          minRatio: 0.8
      }),
      new WebpackAssetsManifest({
        writeToDisk: true,
        sortManifest: false
      }),
    ],
    optimization: {
      minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        new UglifyJsPlugin({
          cache: !dev,
          parallel: true,
          uglifyOptions: {
            compress: true,
            ecma: 6,
            mangle: true
          },
          sourceMap: dev
        })
      ],
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          commons: {
            name: "vendor",
            chunks: "initial",
            minChunks: Infinity
          }
        }
      }
    }
  };
};

exports.setupFriendlyErrors = function() {
  return {
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
    ],
  }
};

exports.setupNoEmit = function() {
  return {
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }
};

exports.setupLoaderOptions = function() {
  return {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: dev,
      }),
    ],
  }
};

exports.setupHotReplace = function() {
  return {
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  }
};

exports.setupFavicon = function(logo) {
  return {
    plugins: [
      new FaviconsWebpackPlugin({
        logo,
        prefix: 'icons-[hash]/',
        emitStats: false,
        title: process.env.npm_package_config_productName,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: true,
          twitter: true,
          yandex: false,
          windows: false
        },
      }),
    ]
  }
};

exports.setupEntries = function(paths) {
  return {
    entry: {
      ...paths,
      vendor: ['react', 'react-router', 'redux', 'react-redux', 'react-dom', 'react-router-redux', 'redux-form'],
    },
  }
};

exports.setupResolves = function(paths) {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: paths,
    },
  }
};

exports.setupLint = function(include) {
  return {
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          enforce: "pre",
          use: [{
            loader: 'eslint-loader',
          }],
          include,
        },
      ]
    },
  }
};

exports.setupBabel = function(include) {
  return {
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }],
          include,
        }
      ]
    },
  }
};

exports.setupDevServer = function(options) {
  return {
    devServer: {
      contentBase: options.contentBase || false,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      //host: options.host || '0.0.0.0', // Defaults to `localhost`
      port: options.port, // Defaults to 8080
      proxy: options.proxy,
      headers: options.headers,
      disableHostCheck: options.disableHostCheck
    },
  };
};

// Template
exports.setupTemplate = function (template, title, filename, favicon = false) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title,
        filename,
        template,
        inject: true,
        inlineSource: '.(js|css)$',
        favicon,
      }),
    ]
  };
};

// Checks for .css files in the paths referenced in 'includes'
// Runs loaders in right-to-left order
// See: style-loader, css-loader for more information
exports.setupCSS = function (paths) {
  return {
    module: {
      rules: [{
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: dev } },
          { loader: 'css-loader', options: { sourceMap: dev } },
          { loader: 'postcss-loader', options: { sourceMap: dev, plugins: () => [require('autoprefixer')] } },
          { loader: 'sass-loader', options: { sourceMap: dev } }
        ],
      }]
    }
  };
};

exports.setupFonts = function (from) {
  return {
    plugins: [
      new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output, 'fonts'),
      }]),
    ],
  };
};

// Compress Images
exports.setupImages = function (from) {
  return {
    plugins: [
      new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output, 'images'),
      }]),
    ],
  };
};
