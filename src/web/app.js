import React from 'react';
import { render } from 'react-dom';
import configureStore, { history } from 'store';

import Root from 'components/Root';

const store = configureStore();

console.log(process.env);

if (process.env.NODE_ENV === 'development-android') {
  render(
    <Root store={store} history={history} />,
    document.getElementById('root'),
  );

  if (module.hot) {
    module.hot.accept('components/Root', () => {
      const NextRoot = require('components/Root'); // eslint-disable-line global-require

      render(
        <NextRoot store={store} history={history} />,
        document.getElementById('root'),
      );
    });
  }
} else {
  /* eslint-disable global-require */

  const hotLoader = require('react-hot-loader');

  const { AppContainer } = hotLoader;

  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root'),
  );

  if (module.hot) {
    module.hot.accept('components/Root', () => {
      const NextRoot = require('components/Root'); // eslint-disable-line global-require

      render(
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('root'),
      );
    });
  }

  /* eslint-enable global-require */
}
