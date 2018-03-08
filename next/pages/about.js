import React, { Component } from 'react';
import withRedux from 'next-redux-wrapper';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import initStore from 'stores';

// Scenes
import Public from 'scenes/public';

// Screens
import { default as ScreenAbout } from 'scenes/public/screens/About';

import 'assets/styles/app.scss';

class About extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Public>
          <ScreenAbout />
        </Public>
      </MuiThemeProvider>
    );
  }
}

export default withRedux(initStore, null, null)(About);
