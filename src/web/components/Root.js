// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Routes from 'routes';

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <PersistGate loading={null} persistor={persistStore(this.props.store)}>
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <ConnectedRouter history={this.props.history}>
              <Routes />
            </ConnectedRouter>
          </MuiThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
