import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import routes from 'src/components/routes';
import Public from 'app/scenes/public';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Public>
          <Switch>
            {routes.map(route => <Route key={route.path} {...route} />)}
          </Switch>
        </Public>
      </MuiThemeProvider>
    );
  }
}

export default App;
