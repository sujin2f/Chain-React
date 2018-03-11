const withSass = require('@zeit/next-sass');
const path = require('path');

const PATHS = {
  app: path.resolve(__dirname, './app'),
  src: path.resolve(__dirname, './src/next')
};

module.exports = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192,
            publicPath: "/_next/static/images/",
            outputPath: "../static/images",
            name: "[name]-[hash].[ext]"
          }
        }
      ]
    });

    config.resolve.modules.push(PATHS.app);
    config.resolve.modules.push(PATHS.src);

    return config;
  },
  sassLoaderOptions: {
    includePaths: ["app/assets/styles"],
  },
});
