import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from "redux-persist";

import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import persistConfig from 'persistConfig';

import reducers from "reducers";

export default (initialState) => {
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

  const persistedReducer = persistReducer(persistConfig, reducers);

  const store =  createStore(persistedReducer, initialState, applyMiddleware(...middleware));

  setTimeout(() => {
    persistStore(store, null, () => {});
    persistStore(store);
  }, 1000);

  return store;
}
