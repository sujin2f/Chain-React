/* eslint-disable */
const path = require('path');
const pack = require('../package.json');
const info = pack.build;

const TARGET = process.env.npm_lifecycle_event;

let MODE = 'build';
let src;

console.log('TARGET:' + TARGET);

switch (TARGET) {
  case 'start':
    MODE = 'development';
    src = 'web';
    break;

  case 'dev:ios':
  case 'emulator:ios':
    MODE = 'development';
    src = 'ios';
    break;

  case 'dev:android':
  case 'emulator:android':
  case 'prepare':
    MODE = 'development';
    src = 'android';
    break;

  case 'dev:next':
    MODE = 'development';
    src = 'next';
    break;

  case 'build-electron':
  case 'start-electron-dev':
  case 'build-electron-dll':
  case 'start-electron-main-dev':
    MODE = 'development';
    src = 'electron';
    break;
}

const PATHS = {
  app: path.join(__dirname, '../', info.paths.app),
  src: path.join(__dirname, '../', info.paths.src, src),
  build: path.join(__dirname, '../', info.paths.output),
  dll: path.join(__dirname, '../dll'),
  template: path.join(__dirname, '../', info.paths.templates),
};

const PRODUCT = {
  name: info.productName,
  appId: info.appId,
  description: pack.description,
  version: pack.version,
  author: pack.author,
};

process.env.BABEL_ENV = MODE;

module.exports = {
  TARGET,
  MODE,
  PATHS,
  PRODUCT,
};
