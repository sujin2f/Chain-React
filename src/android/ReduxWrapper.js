import { connect } from 'react-redux';

export default function ReduxWrapper(mapStateToProps, mapDispatchToProps, component) {
  return connect(mapStateToProps, mapDispatchToProps)(component);
}
