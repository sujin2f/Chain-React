// Action Types
export const LOGIN_SUCCESS = 'chainreact/auth/LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'chainreact/auth/LOGOUT_SUCCESS';

function loginSuccess(userId, password) {
  return {
    type: LOGIN_SUCCESS,
    userId,
    password,
  };
}

// Get auth Action Creators
export function login(userId, password) {
  return (dispatch) => {
    dispatch(loginSuccess(userId, password));
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  };
}
