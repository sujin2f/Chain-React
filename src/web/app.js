import React from 'react';
import { render } from 'react-dom';
import configureStore, { history } from 'store';
import { AppContainer } from 'react-hot-loader';

import Root from 'src/components/Root';

const store = configureStore();

console.log(process.env);

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept('src/components/Root', () => {
    const NextRoot = require('src/components/Root'); // eslint-disable-line global-require

    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app'),
    );
  });
}

