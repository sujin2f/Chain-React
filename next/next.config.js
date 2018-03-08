const withSass = require('@zeit/next-sass');

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

    return config;
  },
  sassLoaderOptions: {
    includePaths: ["app/assets/styles"],
  },
});
