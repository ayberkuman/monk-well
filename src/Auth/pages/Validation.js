import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";

import { createRef } from "react";
import { Link } from "react-router-dom";
import { globalRoutes, guestRoutes } from "../../App/routes";
import API, { headers } from "../../utils/API";
import { connect } from "react-redux";
import { login } from "../authActions";
import { generateUniqueUserId, scrollToTop } from "../../utils/helper";

class Validation extends Component {
  state = {
    countdown: 120,
    verificationCode: "",
    isButtonActive: false,
    canReceiveAgain: false,
    username: "",
    isSending: false,
  };

  countdownFrom = 120;

  verificationInput = createRef(null);

  componentDidMount = () => {
    scrollToTop();

    const registeredUser = JSON.parse(localStorage.getItem("registered-user"));
    if (!registeredUser || !registeredUser.username) {
      this.props.history.push(guestRoutes.auth.links[this.props.lang]);
    } else {
      this.setState({ username: registeredUser.username }, () => {
        const diff = moment
          .duration(moment(new Date()).diff(moment(registeredUser.codeSentAt)))
          .as("seconds");

        if (diff > this.countdownFrom) {
          this.setState({ countdown: 0, canReceiveAgain: true });
        } else {
          setTimeout(() => this.startCountdown(diff), 20);
        }

        this.verificationInput.current.focus();
      });
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.countdownInterval);
  };

  countdownInterval = "";
  startCountdown = (diff = 0) => {
    this.setState({ countdown: parseInt(this.countdownFrom - diff) }, () => {
      this.countdownInterval = setInterval(() => {
        if (this.state.countdown > 0) {
          this.setState((prevState) => {
            return { countdown: prevState.countdown - 1 };
          });
        } else {
          this.setState({ canReceiveAgain: true });
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    });
  };

  handleChange = (e = null) => {
    const { value } = this.verificationInput.current;
    const els = document.querySelectorAll(
      ".verification-code-area .verification-code"
    );

    if (value.length <= 6) {
      this.setState({ verificationCode: value }, () => {
        this.setState({
          isButtonActive: this.state.verificationCode.length === 6,
        });
        els.forEach((el, index) =>
          value.length > index
            ? el.classList.add("filled")
            : el.classList.remove("filled")
        );
      });
    }

    if (value.length === 6) {
      this.handleSubmit();
    }
  };

  handleReceiveCode = (e) => {
    e.preventDefault();

    API.post(
      "Account/ResendConfirm",
      { username: this.state.username },
      { headers }
    )
      .then((r) => {
        const { status, info } = r.data;

        if (status) {
          this.props.showAlert(
            "success",
            "Kod gönderildi!",
            info.friendlyMessage,
            3000
          );

          const registeredUser = {
            username: this.state.username,
            codeSentAt: new Date(),
          };

          window.cookies.set('user', JSON.stringify(registeredUser), { path: '/' });

          this.startCountdown();
        }
      })
      .catch((err) => console.log(err));
  };

  handleSubmit = (e = null) => {
    if (e) e.preventDefault();

    this.setState({ isSending: true }, async () => {
      const deviceId = await generateUniqueUserId();

      const data = {
        deviceId,
        username: this.state.username,
        code: this.state.verificationCode,
      };

      API.post("Account/Confirm", data, { headers })
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
              "Hesabınız onaylandı!",
              "Keşfet sayfasına yönlendiriliyorsunuz...",
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

              this.props.history.push(globalRoutes.home.links[this.props.lang]);
            }, 1500);
          }
        })
        .catch((err) => {
          (err);
          this.setState({ isSending: false });
        });
    });
  };

  render() {
    return (
      <>
        <Helmet title="E-posta Onayı" />
        <div className="Auth validation">
          <div className="container">
            {this.state.countdown > 0 ? (
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                  <p className="validation-desc text-center w-100">
                    Lütfen üyelik onayı için mail adresinize gelen doğrulama
                    kodunu aşağıya giriniz.
                  </p>
                  <p className="validation-desc text-center w-100">
                    Doğrulama kodunu girmek için{" "}
                    <span>{this.state.countdown} saniye</span> saniye kaldı.
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="flex-1">
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
                  <button
                    className="primary-button"
                    disabled={
                      !this.state.isButtonActive || this.state.isSending
                    }
                    onClick={() => this.handleSubmit()}
                  >
                    {this.state.isSending ? "Onaylanıyor..." : "Onayla"}
                  </button>
                </div>
              </div>
            </div>
            {this.state.canReceiveAgain ? (
              <>
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <p className="code-not-recieved-text text-center">
                      Mesaj gelmediyse
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3 text-center">
                    <Link
                      to={"#!"}
                      className="code-not-recieved-link"
                      onClick={this.handleReceiveCode}
                    >
                      Tekrar kod al
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className="row">
              <div className="col-12 text-center">
                <p className="disclaimer">
                  Hesap oluşturarak, <Link to="#!">Kullanım Koşullarımızı</Link>{" "}
                  ve <Link to="#!">Gizlilik Sözleşmemizi</Link> okuyup, kabul
                  ettiğiniz onaylamış olursunuz.
                </p>
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

export default connect(null, mapDispatchToProps)(Validation);
