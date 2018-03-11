import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
// import Root from 'components/Root';
// import configureStore, { history } from 'store';

/*
const store = configureStore();

console.log(process.env);
console.log(window);
*/

/*
render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
*/

render(
  <div>
    Yea
  </div>,
  document.getElementById('root')
);

/*
if (module.hot) {
  module.hot.accept('components/Root', () => {
    const NextRoot = require('components/Root'); // eslint-disable-line global-require

    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
*/
