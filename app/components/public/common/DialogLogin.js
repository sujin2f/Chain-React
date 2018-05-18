import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import MaterialText from 'app/components/common/MaterialText';
import required from 'app/utils/validators';

class DialogLogin extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.getValidated = this.getValidated.bind(this);
  }

  componentWillMount() {
    this.setState({
      validated: {},
    });
  }

  setValidated(name, validated) {
    const s = { ...this.state };
    s.validated[name] = validated;

    this.setState(s);
  }

  getValidated() {
    let error = false;

    Object.keys(this.state.validated)
      .map(k => this.state.validated[k])
      .forEach((result) => {
        if (result) {
          error = true;
        }
      });

    return error;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        disabled={this.getValidated()}
        onClick={e => this.handleSubmit(e)}
      />,
    ];

    return (
      <Dialog
        title="Login"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        <form
          id="form-login"
          onSubmit={e => this.handleSubmit(e)}
        >
          <MaterialText
            name="userId"
            label="User ID"
            form="loginForm"
            fullWidth
            validate={required}
            setValidated={this.setValidated}
          />

          <MaterialText
            name="password"
            label="Password"
            form="loginForm"
            fullWidth
            validate={required}
            type="password"
            setValidated={this.setValidated}
          />
        </form>
      </Dialog>
    );
  }
}

export default reduxForm({
  form: 'loginForm',
})(DialogLogin);
