import React, { Component } from 'react';

import Lorem from 'app/components/public/common/Lorem';

class About extends Component {
  render() {
    return (
      <section>
        <div className="row">
          <div className="columns small-12">
            <h1>About</h1>
            <Lorem />
            <img src="/images/favicon-32x32.png" alt="Favicon" />
          </div>
        </div>
      </section>
    );
  }
}

export default About;
