import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { Helmet } from 'react-helmet';
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
          <Helmet>
            <meta charSet="utf-8" />
            <title>Chain React</title>
            <link rel="icon" type="image/png" href="/images/favicon-32x32.png" sizes="16x16" />
            <link rel="icon" type="image/png" href="/images/favicon-16x16.png" sizes="32x32" />
          </Helmet>

          <Switch>
            {routes.map(route => <Route key={route.path} {...route} />)}
          </Switch>
        </Public>
      </MuiThemeProvider>
    );
  }
}

export default App;
