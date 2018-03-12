import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { persistReducer } from 'redux-persist';

import rootReducer from 'reducers';
import persistConfig from 'persistConfig';

export const history = createHistory();

const configureStore = (initialState = {}) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development-android') {
    const logger = createLogger({
      level: 'info',
      collapsed: true,
    });

    middleware.push(logger);
  }

  console.log(process.env.NODE_ENV);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Create Store
  const store = createStore(persistedReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers'))); // eslint-disable-line global-require
  }

  return store;
};

export default configureStore;
//  history;
