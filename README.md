# Chain React

### This project is for making mobile applications (Android and iOS), Web (both server-side rendering and plain web page), and Desktop application with one [React](https://facebook.github.io/react/) code.

- The [Electron](http://electron.atom.io/) part of this project is based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
- The persist store for [Next](https://zeit.co/blog/next5) is based on [examples-redux-persist-next](https://github.com/nickmarca/examples-redux-persist-next)
- The [Apache Cordova](https://cordova.apache.org/) part of this project is based on [phonegap-template-react-hot-loader](https://github.com/phonegap/phonegap-template-react-hot-loader)

## Table of Contents

* [Installation](#installation)
  * [Install the Apache Cordova](#install-the-apache-cordova)
* [Running](#running)
  * [Plain Website](#plain-website)
  * [Server-side Rendering Website](#server-side-rendering-website)
  * [Electron](#electron)
  * [Android/ iOS](#android-ios)
  * [Embedding the Webview on Android Studio](#embedding-the-webview-on-android-studio)
  * [Embedding the Webview on Xcode](#embedding-the-webview-on-xcode)
* [Configuration](#configuration)
* [Directory Structure and Development](#directory-structure-and-development)
  * [Link and Redux Connect](#link-and-redux-connect)
  * [Design](#design)
  * [Persist Store](#persist-store)
  * [Routes](#routes)
  * [File Extenson](#file-extenson)

## Installation

First, clone the repo via git:


```
$ git clone --depth=1 https://github.com/sujin2f/chain-react.git your-project-name
```

And then install dependencies

```
$ npm install
```

### Install the Apache Cordova

Run this to start the development webpack server

```
$ npm run dev:android

or

$ npm run dev:ios
```

Open it in the iOS Simulator by running (in another terminal):

```
$ cordova platform add ios
$ npm run emulator:ios
```

Open it in the Android Simulator by running (in another terminal):

```
$ cordova platform add android
$ cordova plugin add cordova-plugin-whitelist
$ npm run emulator:android
```

If you get an error for Gradle setting, [follow this instruction](https://gradle.org/install/).

Android emulator won't be opened by itself. You should open the emulator via Android Studio or connect your device to your computer. If you want to open the emulator on the command line, [follow this instruction](https://developer.android.com/studio/run/emulator-commandline.html).

## Running

### Plain Website

To run the plain website:

```
$ npm start
```

### Server-side Rendering Website

To run the server-side rendering website (next.js):

```
$ npm dev:next
```

### Electron

To run the Electron:

```
$ npm dev:electron
```

### Android/ iOS

See the [Install the Apache Cordova](#install-the-apache-cordova) part.

### Embedding the Webview on Android Studio

#### NOTE: I should update this part, but it should be helpful to implementation

`Phonegap` is the good option to make cross-platform mobile application, but you can't access some Android or iOS features with it. You may need to develop on the Android Studio with React web view.

[Follow this instruction](http://docs.phonegap.com/develop/1-embed-webview/android/), make the project directory to `android`. For example, my command is like this:

```
$ ~/Downloads/cordova-android-master/bin/create android com.test.testapp
```

Then, build the project

```
$ cd common
$ npm run build:android
```

When you execute the [Step 3: Import the project into Android Studio](http://docs.phonegap.com/develop/1-embed-webview/android/), you will see your web view on the Android simulator.

### Embedding the Webview on Xcode

#### NOTE: I should update this part, but it should be helpful to implementation

[Follow this instruction](http://docs.phonegap.com/develop/1-embed-webview/ios/), make the project directory to `ios`. When you make an iOS project with Xcode, the project name should be `ios`. The directory structure should be:

```
+-- common
+-- electron
+-- next
+-- ios
|   +-- ...
|   +-- iosTests
|   +-- iosUITests
+-- info.json
+-- LICENSE
+-- README.md
```

Set `pod` and make the `ViewController` to `CDVViewController`, then build the React project.

```
$ cd common
$ npm run build:ios
```

## Configuration

The default name of your applications is `Chain React`. To change this kind of configuration, you need to edit the `package.json` file on the root directory.

```
# package.json
{
  ...
  "build": {
    "productName": "Chain React",
    "appId": "com.sujinc.chaninreact",
    "paths": {
      "app": "./app",
      "src": "./src",
      "output": "./www",
      "templates": "./templates"
    }
  },
  ...
}
```

Cordova iOS doesn't allow to change the product name on fly, to change the configurations for Cordova, edit the `config.xml` file.

## Directory Structure and Development

Every mode shares the `app` folder. This is the place your code would be. The `src` folder contains unique components, so you can set the different entry point or menu for each applications.

### Link and Redux Connect

Each app's configurations are different, so you should call the same location for calling different components. For example, the anchor tag `<Link />` when you use `react-router-dom`, but the link for `next.js` is from `next/link`. To solve this problem, `Chain React` has `src/[application]` directories.

```
# Example Component

import React, { Component } from 'react';

import Link from 'components/Link'; // This calls /src/[application]/components/Link

class MyComponent extends Component {
  render() {
    const {
      userId,
      logout,
    } = this.props;

    return (
      <section>
        <Link href="/">Home</Link>
      </section>
    );
  }
}

export default MyComponent;
```

Redux `connect()` is same.

```
# Example Container

import ReduxWrapper from 'ReduxWrapper'; // This calls /src/[application]/ReduxWrapper

import MyComponent from 'components/MyComponent';

import {
  action,
} from 'actions/action';

const mapStateToProps = state => ({
  prop: state.prop,
});

const mapDispatchToProps = dispatch => ({
  action: () => {
    dispatch(action());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, MyComponent);
```

### Design

`/app/assets/styles/app.scss` is the common `scss` file. It's already installed [Zurb Foundation](https://foundation.zurb.com/). Moreover, you can use [Material-UI](http://www.material-ui.com/) as well.

The favicons are in `/app/assets/images/`.

### Persist Store

Persistent store setting is on `/app/persistConfig.js`.

```
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'auth',
  storage,
};

export default persistConfig;
```

### Routes

Each application may use different router settings. For example, your web may start with introduction page which has a blog menu, and your desktop application's start page would be the login page. You can adjust this with each router configurations.

See `src/[application]/router.js` and `next/src/pages` folder.

### File Extenson

Your `.jsx` files should be `.js` because `next.js` supports only `.js` file extension.
