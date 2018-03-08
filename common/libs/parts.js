/* eslint-disable */

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // For clearing the build directory
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // Pulls CSS out of Components into their own chunk
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
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
      contentBase: "public/",
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
      watchOptions: {
        ignored: "node_modules",
        poll: true
      },
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
      proxy: options.proxy
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
};

// Embed Fonts
exports.setupFonts = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          loader: 'url',
          query: {
            name: 'fonts/[name]-[hash].[ext]',
            limit: 100000,
            mimetype: 'application/font-woff'
          },
          include: paths
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file',
          query: {
            name: 'fonts/[name]-[hash].[ext]'
          },
          include: paths
        },
      ]
    }
  }
};

// Compress Images
exports.setupImages = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            'file?hash=sha512&digest=hex&name=images/[name]-[hash].[ext]',
            'image-webpack'
          ]
        }
      ]
    },
    imageWebpackLoader: {
      mozjpeg: {
        quality: 65
      },
      pngquant:{
        quality: "65-90",
        speed: 4
      },
      svgo:{
        plugins: []
      }
    }
  }
};

// Checks for .css files in the paths referenced in 'includes'
// Runs loaders in right-to-left order
// See: style-loader, css-loader for more information
exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.s?css$/,
          loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap'],
          include: paths
        }
      ]
    },
    postcss: [autoprefixer({browsers: ['last 2 versions']}), flexibility]
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
exports.babel = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader?cacheDirectory',
          include: paths
        }
      ]
    },
  };
};

// Template
//
exports.template = function (path, title) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title: title,
        filename: 'index.html',
        template: path,
      }),
    ]
  };
};
