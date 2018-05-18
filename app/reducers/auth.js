import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from 'app/actions/auth';

const initialState = {
};

function auth(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        userId: action.userId,
      };
    }

    case LOGOUT_SUCCESS: {
      return { ...initialState };
    }

    default: {
      return state;
    }
  }
}

export default auth;
