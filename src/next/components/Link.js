import React, { Component } from 'react';

import NextLink from 'next/link';

class Link extends Component {
  render() {
    return (
      <NextLink
        href={this.props.href}
        id={this.props.id}
        className={this.props.className}
      >
        <a>{this.props.children}</a>
      </ReactLink>
    );
  }
}

export default Link;
