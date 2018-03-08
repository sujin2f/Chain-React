# Chain React

### This project is for making Android application, Web (both server-side rendering and plain web page), and Desktop application with one [React](https://facebook.github.io/react/) code.

- The [Electron](http://electron.atom.io/) part of this project is based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
- The persist store for [Next](https://zeit.co/blog/next5) is based on [examples-redux-persist-next](https://github.com/nickmarca/examples-redux-persist-next)

## Table of Contents

* [Installation](#isntallation)
  * [Install the Common Directory](#install-the-common-directory)
  * [Install the Electron Directory](#install-the-electron-directory)
  * [Install the Next Directory](#install-the-next-directory)
  * [Install the Phonegap](#install-the-phonegap)
  * [Embedding the Webview on Android Studio](#embedding-the-webview-on-android-studio)
  * [Embedding the Webview on Xcode](#embedding-the-webview-on-xcode)
* [Change the Name](#change-the-name)
* [Change the Bulid Paths](#change-the-bulid-paths)
* [Link and Redux Connect](#link-and-redux-connect)
* [Design](#design)
* [Persist Store](#persist-store)
* [Routes](#routes)
* [File Extenson](#file-extenson)

## Installation

In the code, there're three directories, `common`, `electron`, and `next`. `Common` directory is for the static website and mobile application. `Electron` directory is for desktop applications, and `next` directory is for server-side rendering web site. Each directory has a subdirectory named `app`. Those directories should be the same. You need to make git repository and make it as a submodule.

### Install the Common Directory

To install the `common` directory:

```
$ cd common
$ npm install
$ npm start
```

It will start the development mode on `http://localhost:8080`.

### Install the Electron Directory

To install the `electron` directory:

```
$ cd electron
$ npm install
$ npm run dev
```

It will start the development mode on the `Electron` application.

### Install the Next Directory

To install the `next` directory:

```
$ cd next
$ npm install
$ npm run dev
```

It will start the development mode on `http://localhost:3000`.

### Install the Phonegap

[Phonegap](https://phonegap.com/getstarted/) is for making `Android` and `iOS` mobile applications. To install the Phonegap project on Chain React, [follow the installation guide of Phonegap](https://phonegap.com/getstarted/).

On step 3 of the instruction, you need to install your Phongap project on the `phonegap` directory in your Chain React, so your directory structure should be:

```
+-- common
+-- electron
+-- next
+-- phonegap
|   +-- ...
|   +-- www
+-- info.json
+-- LICENSE
+-- README.md
```

Your React build will be placed on the `www` directory. To install your application onto the `phonegap` directory:

```
$ cd common
$ npm run build:phonegap
```

### Embedding the Webview on Android Studio

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
## Change the Name

The default name of your applications is `Chain React`. To change this, you need to edit the `info.json` file on the root directory.

```
# info.json
{
  "title": "Chain React"
  "paths": {
    "android": "../android/app/src/main/assets/www",
    "ios": "../ios/Pods/phonegap-ios-template/resources/www",
    "phonegap": "../phonegap/www"
  }
}
```

## Change the Bulid Paths

On the instruction above, the application name of `Phonegap`, `Android`, and `iOS` could be `phonegap`, `android`, and `ios`. To make build paths to your destination directory, you need to change the `info.json`.

```
# info.json
{
  "title": "Chain React"
  "paths": {
    "android": "../android/app/src/main/assets/www",
    "ios": "../ios/Pods/phonegap-ios-template/resources/www",
    "phonegap": "../phonegap/www"
  }
}
```

The paths are relative paths from the `common` directory.

## Link and Redux Connect

Each app's configurations are different, so you should call the same location for calling different components. For example, the anchor tag `<Link />` when you use `react-router-dom`, but the link for `next.js` is from `next/link`. To solve this problem, `Chain React` made `src` directory on each sub-directories.

```
# Example Component

import React, { Component } from 'react';

import Link from 'components/Link'; // This calls /src/components/Link for each application (common, electron, and next)

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

import ReduxWrapper from 'ReduxWrapper'; // This calls /src/ReduxWrapper for each application (common, electron, and next)

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

## Design

`/app/assets/styles/app.scss` is the common `scss` file. It's already installed [Zurb Foundation](https://foundation.zurb.com/). Moreover, you can use [Material-UI](http://www.material-ui.com/) as well.

The favicons are in `/app/assets/images/`.

## Persist Store

Persistent store setting is on `/app/persistConfig.js`.

```
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'auth',
  storage,
};

export default persistConfig;
```

## Routes

Each application may use different router settings. For example, your web may start with introduction page which has a blog menu, and your desktop application's start page would be the login page. You can adjust this with each router configurations.

See `common/src/router.js`, `electron/src/routes.js`, and `next/src/pages` folder.

## File Extenson

Your `.jsx` files should be `.js` because `next.js` supports only `.js` file extension.
