require('babel-register')({
  presets: ['env'],
  plugins: [
    ['module-resolver', {
      alias: {
        src: './src/ssr',
        app: './app',
      },
    }],
  ],
});
require('./server/index');
