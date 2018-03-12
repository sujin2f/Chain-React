'use strict';

const TARGET = process.env.npm_lifecycle_event;
let env = 'build';

switch (TARGET) {
  case 'dev:cordova':
  case 'emulator:ios':
  case 'emulator:android':
    env = 'development';
}

module.exports = env;
