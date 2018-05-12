import { CLEAR_FORM } from 'actions/forms/loginForm';

const initialState = {};

function loginForm(state = initialState, action) {
  switch (action.type) {
    case CLEAR_FORM: {
      return { ...initialState };
    }

    default: {
      return state;
    }
  }
}

export default loginForm;
