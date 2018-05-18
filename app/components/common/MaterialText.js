import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ReduxWrapper from 'src/ReduxWrapper';

const mapStateToProps = state => ({
  forms: state.forms,
});

const mapDispatchToProps = dispatch => ({
  handleChange: (form, field, payload) => {
    dispatch({
      type: '@@redux-form/CHANGE',
      meta: {
        form,
        field,
        touch: false,
        persistentSubmitErrors: false,
      },
      payload: payload.target.value,
    });
  },
  updateSyncError: (form, field, error) => {
    dispatch({
      type: '@@redux-form/UPDATE_SYNC_ERRORS',
      meta: {
        form,
      },
      payload: {
        syncErrors: {
          [field]: error,
        },
      },
    });
  },
});

class MaterialText extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    if (props.validate) {
      props.setValidated(props.name, 'N/A');
    }
  }

  componentWillMount() {
    this.setState({
      error: null,
    });
  }

  onChange(payload) {
    const {
      name,
      form,
      handleChange,
      updateSyncError,
      setValidated,
      onChange,
      validate,
    } = this.props;

    handleChange(form, name, payload);

    if (onChange) {
      onChange(payload.target.value);
    }

    if (validate) {
      const validates = !Array.isArray(validate) ? [validate] : validate;

      validates.forEach((v) => {
        const result = v(payload.target.value);

        this.setState({
          ...this.state,
          error: result,
        });

        updateSyncError(form, name, result);
        setValidated(name, result);
      });
    }
  }

  render() {
    const {
      id,
      name,
      form,
      fullWidth,
      label,
      type,
    } = this.props;

    const value = this.props.forms[form].values && this.props.forms[form].values[name]
      ? this.props.forms[form].values[name]
      : '';

    return (
      <TextField
        className="material-textfield"
        id={id}
        value={value}
        onChange={v => this.onChange(v)}
        fullWidth={fullWidth}
        floatingLabelText={label}
        errorText={this.state.error}
        type={type || 'text'}
      />
    );
  }
}

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, MaterialText);
