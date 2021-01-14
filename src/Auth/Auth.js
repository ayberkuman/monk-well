import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { guestRoutes } from "../App/routes";
import { login } from "./authActions";
import { connect } from "react-redux";
import { scrollToTop } from "../utils/helper";

class Auth extends Component {
  componentDidMount = () => scrollToTop();
 

  render() {
    return (
      <>
        
          <Helmet title="Üye Girişi" />
          <div className="Auth position-relative">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                  <p className="auth-desc text-center w-100"></p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                  <Link
                    to={guestRoutes.login.links[this.props.lang]}
                    className="primary-button"
                  >
                    Giriş yap
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                </div>
              </div>
            </div>
          </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user)),
  };
};

export default connect(null, mapDispatchToProps)(Auth);
