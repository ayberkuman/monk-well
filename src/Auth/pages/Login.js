import React, { Component, createRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import _ from 'lodash';
import logoBig from '../../assets/images/big-logo.svg'
import InputWLabel from "../../utils/components/InputWLabel";
import CutomCheckbox from "../../utils/components/CutomCheckbox";
import { guestRoutes } from "../../App/routes";
import API, { headers } from "../../utils/API";
import { login } from "../authActions";
import { connect } from "react-redux";
import {
  scrollToTop,
} from "../../utils/helper";
import { LeftSide } from "./components/LeftSide";



class Login extends Component {
  state = {
    username: "finance@monk.com",
    password: "Secret1+",
    errorMessage: "",
    isSending: false,
  };

  usernameRef = createRef(null);

  componentDidMount = () => {
    scrollToTop();
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      setTimeout(this.handleCheck, 20);
    });
  };


  handleLogin = (e) => {
    e.preventDefault();

    if (
      this.state.username === "" ||
      (this.state.password === "")
    )
      return false;
    this.props.pageLoadingSet(true);
    this.setState({ isSending: true }, async () => {
      const data = {
        username: this.state.username,
        password: this.state.password,
      };

      API.post("Auth", data, { headers: { ...headers } })
        .then((res) => {
          const { email, fullName, id, token } = res.data;
          this.setState({ isSending: false });
          this.props.pageLoadingSet(false);
          if (!_.isUndefined(token)) {
              const user = {
                email,
                fullName,
                id,
                token,
              }
              this.props.login(user);
          }
        })
        .catch((err) => {
          this.props.pageLoadingSet(false);
          this.setState({ isSending: false });
        });
    });
  };

  render() {
    return (
      <>
          <Helmet title="Giriş Yap" />
          <div className="Auth login">
            <div className='row min-vh-100'>
              <div className='col-lg-3  d-none d-lg-block'>
                <LeftSide />
              </div>
              <div className='col-lg-9 d-flex align-items-center'>
                <form action="#!" onSubmit={this.handleLogin} className='flex-1'>
                <div className="container">
                  <div className="row mb-5">
                    <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3 text-center">
                      <img
                      src={logoBig}
                      alt="Monk Medical"
                    />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                      <InputWLabel
                        name="username"
                        type={"email"}
                        id="username"
                        label="E-Posta Adresi"
                        value={this.state.username}
                        setValue={this.handleChange}
                        validate={true}
                        inputRef={this.usernameRef}
                        tabIndex={1}
                        errorMessage={this.state.errorMessage}
                      />
                    </div>
                  </div>
                  <div className="row">
                      <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                        <InputWLabel
                          name="password"
                          type="password"
                          id="password"
                          label="Şifre"
                          value={this.state.password}
                          setValue={this.handleChange}
                          tabIndex={2}
                        />
                      </div>
                    </div>
                  <div className="row">
                    <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                      <button
                        className="primary-button"
                        data-is-sending={this.state.isSending}
                      >
                        {this.state.isSending
                          ? "Giriş yapılıyor..."
                          : "Giriş yap"}
                      </button>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                  <div className='row'>
                    <div className="col-6">
                        <CutomCheckbox labelText='Beni Hatırla'/>
                    </div>
                    <div className="col-6 text-right">
                      <Link
                        className="forgot-pass-link"
                        to={guestRoutes.changePassword.links[this.props.lang]}
                      >
                        Şifremi unuttum
                      </Link>
                    </div>
                    </div>
                    </div>
                  </div>
                </div>
              </form>
              </div>
            </div>
          </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
