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
  scrollToTop, validateInput,
} from "../../utils/helper";
import { LeftSide } from "./components/LeftSide";



class Login extends Component {
  //finance@monk.com Secret1+
  state = {
    email: "",
    emailError:'',
    password: "",
    passwordError:'',
    isSending: false,
  };

  emailRef = createRef(null);

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
    const {email, password} = this.state;

    this.setState(
      {
        passwordError: password === "" ? "Şifrenizi giriniz" : "",
        emailError: !validateInput("email", email)
          ? "Geçerli bir e-posta adresi giriniz"
          : "",
      },
      () => {
        const { emailError, passwordError } = this.state;
        if (emailError === "" || passwordError === "") {
          this.props.pageLoadingSet(true);
          const data = {
            email: email,
            password: password,
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
                };
                this.props.login(user);
              }
            })
            .catch((err) => {
              alert(err.response.data.title);
              this.props.pageLoadingSet(false);
              this.setState({ isSending: false });
            });
        }
      }
    );

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
                <div className='flex-1'>
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
                        name="email"
                        type={"email"}
                        id="email"
                        label="E-Posta Adresi"
                        value={this.state.email}
                        setValue={this.handleChange}
                        validate={true}
                        inputRef={this.emailRef}
                        tabIndex={1}
                        errorMessage={this.state.emailError}
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
                          errorMessage={this.state.passwordError}
                        />
                      </div>
                    </div>
                  <div className="row">
                    <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                      <button
                        className="primary-button"
                        data-is-sending={this.state.isSending}
                        onClick={()=>this.handleLogin()}
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
              </div>
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
