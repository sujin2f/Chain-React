import ReduxWrapper from 'src/ReduxWrapper';

import TopBar from 'app/components/public/layout/TopBar';

import {
  login,
  logout,
} from 'app/actions/auth';

import { clearForm } from 'app/actions/forms/loginForm';

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
