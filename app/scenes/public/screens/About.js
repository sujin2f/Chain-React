import React, { Component } from 'react';

import Lorem from 'components/public/common/Lorem';

class About extends Component {
  render() {
    return (
      <section>
        <div className="row">
          <div className="columns small-12">
            <h1>About</h1>
            <Lorem />
          </div>
        </div>
      </section>
    );
  }
}

export default About;
