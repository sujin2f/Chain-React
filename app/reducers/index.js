import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import loginForm from './forms/loginForm';

const reducer = combineReducers({
  auth,
  forms: formReducer.plugin({
    loginForm,
  }),
  routing: routerReducer,
});

export default reducer;
