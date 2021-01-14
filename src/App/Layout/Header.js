import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";

// import Logo from "../../assets/images/logo.png";
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
    return (
      this.props.user.isLoggedIn ? (
      <header
        data-alt={
          this.props.location.pathname !==
          guestRoutes.login.links[this.props.lang]
        }
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col col-md-4 col-xl-5 d-flex justify-content-end align-items-center">
                <span className="d-none d-md-flex">
                {console.log(this.props.user)}
                  <UserArea
                    user={this.props.user}
                    isProfilePopupOn={this.state.isProfilePopupOn}
                    showProfilePopup={this.showProfilePopup}
                    logout={this.props.logout}
                    profilePopupRef={this.profilePopupRef}
                    lang={this.props.lang}
                    update={this.props.update}
                  />
                </span>
              </div>
          </div>
        </div>
      </header>
    ):(<div></div>)
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
