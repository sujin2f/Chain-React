/* eslint-disable */

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // For clearing the build directory
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // Pulls CSS out of Components into their own chunk
const PurifyCSSPlugin = require('purifycss-webpack');
const autoprefixer = require('autoprefixer');
const flexibility = require('postcss-flexibility');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.environment = function (options) {
  return {
    plugins: [
      new webpack.DefinePlugin({...options}),
    ]
  }
};

exports.devServer = function (options) {
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

// Embed Fonts

exports.setupFonts = function (paths) {
  return {
    module: {
      rules: [
        // WOFF Font
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            }
          },
          include: paths
        },
        // WOFF2 Font
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            }
          },
          include: paths
        },
        // TTF Font
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          },
          include: paths
        },
        // EOT Font
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader',
        },
        // SVG Font
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
            }
          },
          include: paths
        },
      ]
    }
  };
};

// Compress Images
exports.setupImages = function (paths) {
  return {
    module: {
      rules: [{
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ],
        include: paths
      }]
    }
  }
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
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [require('autoprefixer')] } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
        include: paths
      }]
    }
  };
};

// Extracts CSS from within modules into a separate CSS file
// Helps to combat FOUT since bundled CSS would have to wait for the JS to run before being applied
// Only used in Production
exports.extractCSS = function (paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.s?css$/,
          loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass']),
          include: paths
        }
      ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }), flexibility ],
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
};

// Removes unused CSS rules
exports.purifyCSS = function (paths) {
  const pathsArr = ('string' === typeof paths) ? [paths] : [...paths];
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        // `paths` is used to point PurifyCSS to files not
        // visible to Webpack. You can pass glob patterns
        // to it.
        paths: pathsArr
      }),
    ]
  }
};


// Minification using the UglifyJS package that's part of Webpack
exports.uglifyjs_plugin = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,
        // Eliminate comments
        comments: false,
        // Compression specific options
        compress: {
          warnings: false,
          // Drop `console` statements
          drop_console: true
        },
        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$'],
          // Don't care about IE8
          screw_ie8: true,
          // Don't mangle function names
          keep_fnames: true
        }
      })
    ]
  };
};


exports.uglifyjs_loader = function (paths) {
  return {
    module: {
      loaders: [
        {
          // I want to uglify with mangling only app files, not thirdparty libs
          test: /\.jsx?$/,
          include: paths,
          exclude: /.spec.js/, // excluding .spec files
          loader: "uglify"
        }
      ]
    },
    'uglify-loader': {
      mangle: false
    }
  };
};


// Splits the bundle into manageable chunks allowing us to create chunk files that don't change (like React core)
// while allowing us to rebuild and replace parts that do change like our app code itself
// Supports caching via manifest files. We only update the chunks that have changed and can preserve the other chunks in cache.
exports.extractBundle = function (options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
};

// Cleans contents of path
// Usage 1: parts.clean(paths.join(PATHS.build, '*')) // Removes everything except for dotfiles from build directory
// Usage 2: parts.clean(PATHS.build) // Removes everything from build directory
exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
};


// Babel
// Check .babelrc for full config options
//
exports.babel = function () {
  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        }
      ]
    },
  };
};

// Template
//
exports.template = function (path, title, filename = 'index.html') {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title: title,
        filename: filename,
        template: path,
        inject: true,
        inlineSource: '.(js|css)$'
      }),
    ]
  };
};
