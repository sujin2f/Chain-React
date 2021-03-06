import React, { Component } from 'react';

import Link from 'components/Link';
import DialogLogin from 'components/public/common/DialogLogin';

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.handleLoginDialogClose = this.handleLoginDialogClose.bind(this);
    this.handelLoginDialogOpen = this.handelLoginDialogOpen.bind(this);
    this.handleLoginDialogSubmit = this.handleLoginDialogSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({
      loginDialog: false,
    });
  }

  handleLoginDialogClose() {
    this.setState({
      ...this.state,
      loginDialog: false,
    });

    this.props.clearForm();
  }

  handelLoginDialogOpen() {
    this.props.clearForm();
    this.setState({
      ...this.state,
      loginDialog: true,
    });
  }

  handleLoginDialogSubmit() {
    const {
      login,
      loginFormValue: { userId, password },
    } = this.props;

    login(userId, password);
    this.handleLoginDialogClose();
  }

  render() {
    const {
      userId,
      logout,
    } = this.props;

    return (
      <section className="top-bar">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu>
            <li className="menu-text">Chain React</li>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            {!userId &&
              <li><a onClick={() => this.handelLoginDialogOpen()}>Login</a></li>
            }
            {userId &&
              <li><a onClick={() => logout()}>Logout</a></li>
            }
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="menu">
            {userId &&
              <li style={{ paddingRight: '10px' }}>Hi, {userId}</li>
            }
            <li><input type="search" placeholder="Search" /></li>
            <li><button type="button" className="button">Search</button></li>
          </ul>
        </div>

        <DialogLogin
          open={this.state.loginDialog}
          handleClose={this.handleLoginDialogClose}
          handleSubmit={this.handleLoginDialogSubmit}
        />
      </section>
    );
  }
}

export default TopBar;
