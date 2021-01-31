import React, { Component } from "react";
import { Helmet } from "react-helmet-async";


import { createRef } from "react";
import { authRoutes, guestRoutes } from "../../App/routes";
import API, { headers } from "../../utils/API";
import { connect } from "react-redux";
import { login } from "../authActions";
import { generateUniqueUserId, scrollToTop } from "../../utils/helper";
import InputWLabel from "../../utils/components/InputWLabel";

class ChangePassword extends Component {
  state = {
    verificationCode: "",
    isButtonActive: false,
    username: "",
    newPassword: "",
    isSending: false,
  };

  verificationInput = createRef(null);

  componentDidMount = () => {
    scrollToTop();

    if (this.props.location) {
      let queries = this.props.location.search;

      queries = queries.replace("?", "").split("&");

      if (queries.length >= 2) {
        let username, verificationCode;

        queries.forEach((data) => {
          if (data.startsWith("email")) username = data.replace("email=", "");
          if (data.startsWith("code"))
            verificationCode = data.replace("code=", "");
        });

        if (username && verificationCode) {
          this.setState({ username, verificationCode });
          return true;
        }
      }
    }

    const registeredUser = JSON.parse(localStorage.getItem("registered-user"));
    if (!registeredUser || !registeredUser.username) {
      this.props.history.push(guestRoutes.login.links[this.props.lang]);
    } else {
      this.setState({ username: registeredUser.username }, () => {
        this.verificationInput.current.focus();
      });
    }
  };

  handleChange = (e = null) => {
    const { name, value } = e.target;

    if (name === "verificationCode") {
      const els = document.querySelectorAll(
        ".verification-code-area .verification-code"
      );

      if (value.length <= 6) {
        this.setState({ verificationCode: value }, () => {
          els.forEach((el, index) =>
            value.length > index
              ? el.classList.add("filled")
              : el.classList.remove("filled")
          );
        });
      }
    } else {
      this.setState({ [name]: value });
    }

    setTimeout(this.handleCheck, 20);
  };

  handleCheck = () => {
    if (
      this.state.verificationCode.length === 6 &&
      this.state.username !== "" &&
      this.state.newPassword !== ""
    )
      this.setState({ isButtonActive: true });
    else this.setState({ isButtonActive: false });
  };

  handleSubmit = (e = null) => {
    if (e) e.preventDefault();

    if (
      this.state.verificationCode === "" ||
      this.state.username === "" ||
      this.state.newPassword === ""
    )
      return false;

    this.setState({ isSending: true }, async () => {
      const deviceId = await generateUniqueUserId();

      const data = {
        deviceId,
        code: this.state.verificationCode,
        email: this.state.username,
        newPassword: this.state.newPassword,
      };

      API.post("Account/ForgetPasswordConfirmation", data, { headers })
        .then((r) => {
          const { status, info } = r.data;

          if (!status) {
            this.props.showAlert(
              "warning",
              "Kod geçersiz",
              info.friendlyMessage,
              4500
            );
            this.setState({ isSending: false });
            this.verificationInput.current.value = "";
            this.handleChange();
            return false;
          } else {
            this.props.showAlert(
              "success",
              "Şifreniz güncellendi!",
              "Giriş yapıldı!<br />Keşfet sayfasına yönlendiriliyorsunuz...",
              1500
            );

            setTimeout(() => {
              const { data } = r.data;

              const user = {
                deviceId,
                username: data.userName,
                fullName: data.fullName,
                avatar: data.photoUrl,
                email: data.email,
                phoneNumber: data.phoneNumber,
                token: data.token,
                tokenExpire: data.tokenExpireTime,
                refreshToken: data.refreshToken,
                refreshTokenExpire: data.refreshTokenExpireTime,
                hasPassword: data.hasPassword,
              };

              localStorage.removeItem("registered-user");

              this.props.login(user);

              this.props.history.push(authRoutes.home.links[this.props.lang]);
            }, 1500);
          }
        })
        .catch((err) => {
          // alert(err.response.data.value)
          this.setState({ isSending: false });
        });
    });
  };

  render() {
    return (
      <>
      
          <Helmet title="Şifre Sıfırlama" />
          <div className="Auth validation">
            <div className="container">
              {this.state.countdown > 0 ? (
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <p className="validation-desc text-center w-100">
                      Lütfen yeni şifre oluşturmak için mail adresinize gelen
                      doğrulama kodunu aşağıya giriniz.
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className='flex-1'>
                <div className="row">
                  <div className="col-12 col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                    <div
                      className="verification-code-area d-flex justify-content-center align-items-center position-relative"
                      onClick={() => this.verificationInput.current.focus()}
                    >
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[0]}
                      </div>
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[1]}
                      </div>
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[2]}
                      </div>
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[3]}
                      </div>
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[4]}
                      </div>
                      <div className="verification-code d-flex justify-content-center align-items-center">
                        {this.state.verificationCode[5]}
                      </div>
                      <input
                        inputmode="numeric"
                        pattern="[0-9]*"
                        type="tel"
                        name="verificationCode"
                        id="verificationCode"
                        ref={this.verificationInput}
                        value={this.state.verificationCode}
                        onChange={this.handleChange}
                        className="position-absolute"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <InputWLabel
                      name="newPassword"
                      type="password"
                      id="newPassword"
                      label="Yeni Şifre"
                      value={this.state.newPassword}
                      setValue={this.handleChange}
                      tabIndex={1}
                      classes='mt-3'
                      icon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z"
                            fill="#7B788D"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <button
                      className="primary-button"
                      disabled={
                        !this.state.isButtonActive || this.state.isSending
                      }
                      onClick={()=>this.handleSubmit()}
                    >
                      {this.state.isSending ? "Güncelleniyor..." : "Güncelle"}
                    </button>
                  </div>
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

export default connect(null, mapDispatchToProps)(ChangePassword);
