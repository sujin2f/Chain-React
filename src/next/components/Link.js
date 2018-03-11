import React, { Component } from 'react';

import NextLink from 'next/link';

class Link extends Component {
  render() {
    return (
      <NextLink href={this.props.href}><a>{this.props.children}</a></NextLink>
    );
  }
}

export default Link;
