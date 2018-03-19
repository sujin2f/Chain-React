import React, { Component } from 'react';
import { Link as ReactLink } from 'react-router-dom';

class Link extends Component {
  render() {
    return (
      <ReactLink
        to={this.props.href}
        id={this.props.id}
        className={this.props.className}
      >
        {this.props.children}
      </ReactLink>
    );
  }
}

export default Link;
