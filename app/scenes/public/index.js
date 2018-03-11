import React, { Component } from 'react';
import TopBarContainer from 'containers/public/layout/TopBarContainer';

class Public extends Component {
  render() {
    return (
      <div id="Public">
        <TopBarContainer />

        {this.props.children}
      </div>
    );
  }
}

export default Public;
