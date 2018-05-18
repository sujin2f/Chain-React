/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

// Scenes
import Public from 'app/scenes/public';

// Screens
import Home from 'app/scenes/public/screens/Home';
import About from 'app/scenes/public/screens/About';

export default () => (
  <Public>
    <Switch>
      <Route path="/about" component={About} />
      <Route path="/" component={Home} />
    </Switch>
  </Public>
);
