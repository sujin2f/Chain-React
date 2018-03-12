import ReduxWrapper from 'ReduxWrapper';

import TopBar from 'components/public/layout/TopBar';

import {
  login,
  logout,
} from 'actions/auth';

import {
  clearForm,
} from 'actions/forms/loginForm';

const mapStateToProps = state => ({
  userId: state.auth.userId,
  loginFormValue: state.forms.loginForm.values,
});

const mapDispatchToProps = dispatch => ({
  login: (userId, password) => {
    dispatch(login(userId, password));
  },
  logout: () => {
    dispatch(logout());
  },
  clearForm: () => {
    dispatch(clearForm());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, TopBar);
