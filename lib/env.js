/* eslint-disable */
const path = require('path');
const pack = require('../package.json');
const info = pack.build;

const TARGET = process.env.npm_lifecycle_event;

let MODE = 'build';
let src;

switch (TARGET) {
  case 'start':
  case 'dev:cordova':
  case 'emulator:ios':
  case 'emulator:android':
    MODE = 'development';
    src = 'common';
    break;

  case 'dev:next':
    MODE = 'development';
    src = 'next';
    break;

  case 'start-electron-dev':
  case 'build-electron':
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
