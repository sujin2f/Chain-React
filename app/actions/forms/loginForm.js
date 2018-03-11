// Action Types
export const CLEAR_FORM = 'chainreact/loginForm/CLEAR_FORM';

// Get auth Action Creators
export function clearForm() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_FORM,
    });
  };
}

