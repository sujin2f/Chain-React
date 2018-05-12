import { createStore, applyMiddleware } from 'redux';
import reducers from "reducers";

import thunk from 'redux-thunk';

import { createLogger } from 'redux-logger';

export default (initialState, {isServer}) => {
  const middleware = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  return createStore(reducers, initialState, applyMiddleware(...middleware));
}
