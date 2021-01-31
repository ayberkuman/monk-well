import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import avatar from '../../assets/images/avatar.svg'
import { logout, update } from "../../Auth/authActions";
import {
  authRoutes,
  globalRoutes,
  guestRoutes,
} from "../routes";
import { UserArea } from "./components/UserArea";

const allRoutes = {
  ...globalRoutes,
  ...guestRoutes,
  ...authRoutes,
};

class Header extends Component {
  state = {
    isProfilePopupOn: false,
  };

  profilePopupRef = createRef();

  showProfilePopup = (e) => {
    e.preventDefault();

    this.setState(
      (prevState) => {
        return { isProfilePopupOn: !prevState.isProfilePopupOn };
      },
      () => {
        document.addEventListener("click", this.closeProfilePopup, false);
      }
    );
  };

  closeProfilePopup = (e) => {
    if (e.target !== this.profilePopupRef.current) {
      this.setState({ isProfilePopupOn: false }, () => {
        document.removeEventListener("click", this.closeProfilePopup, false);
      });
    }
  };

  render() {
    return this.props.user.isLoggedIn ? (
      <div
        className="header"
        data-alt={
          this.props.location.pathname !==
          guestRoutes.login.links[this.props.lang]
        }
      >
        <div className="row">
          <div className="col-6 d-flex align-items-center">
            <p className='m-0'>{this.props.headerTitle}</p>
          </div>
          <div className="col-6 d-flex justify-content-end align-items-center">
            <span className="d-none d-md-flex">
              <UserArea
                user={this.props.user}
                isProfilePopupOn={this.state.isProfilePopupOn}
                showProfilePopup={this.showProfilePopup}
                logout={this.props.logout}
                profilePopupRef={this.profilePopupRef}
                lang={this.props.lang}
                update={this.props.update}
                avatar={avatar}
              />
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    update: (user) => dispatch(update(user)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Header));
