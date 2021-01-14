import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import logoBig from '../../assets/images/big-logo.svg'
import InputWLabel from "../../utils/components/InputWLabel";
import { scrollToTop } from "../../utils/helper";
import API, { headers } from "../../utils/API";
import { LeftSide } from "./components/LeftSide";

export default class ForgotPassword extends Component {
  state = {
    email: "",
    errorMessage: "",
    isSending: false,
  };

  componentDidMount = () => {
    scrollToTop();
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      setTimeout(this.handleCheck, 20);
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.email === "") return false;

    this.setState({ isSending: true }, async () => {
      let data = { email: this.state.email };
      API.post("Account/ForgetPassword", data, {
        headers: { ...headers },
      })
        .then((r) => {
          const { status, info } = r.data;

          this.setState({ isSending: false });

          if (!status) {
            this.props.showAlert(
              "warning",
              "Bir hata oluştu",
              info.friendlyMessage,
              5500
            );
            return false;
          }

          const registeredUser = {
            username: this.state.email,
            codeSentAt: new Date(),
          };

          window.cookies.set('user', JSON.stringify(registeredUser), { path: '/' });

          this.props.showAlert(
            "success",
            "Son bir adım!",
            info.friendlyMessage,
            5500
          );
        })
        .catch((err) => console.log(err));
    });
  };

  render() {
    return (
      <>
        
          <Helmet title="Şifremi Unuttum" />
          <div className="Auth login">
            <div className='row min-vh-100'>
              <div className='col-lg-3  d-none d-lg-block'>
                <LeftSide />
              </div>
              <div className='col-lg-9 d-flex align-items-center'>
                <form action="#!" onSubmit={this.handleSubmit} className='flex-1'>
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
                      <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3 mb-3">
                        <p className='fs-20'>Şifrenizi mi Unuttunuz?</p>
                        <p>Şifrenizi değiştirmek için kayıtlı olduğunuz eposta adresinizi giriniz.</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                        <InputWLabel
                          name="email"
                          type="email"
                          id="email"
                          label="E-Posta Adresi"
                          value={this.state.email}
                          setValue={this.handleChange}
                          validate={true}
                          tabIndex={1}
                          errorMessage={this.state.errorMessage}
                          icon={
                            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.6667 0H4.33333C1.94324 0 0 1.99307 0 4.44444V15.5556C0 18.0069 1.94324 20 4.33333 20H21.6667C24.0568 20 26 18.0069 26 15.5556V4.44444C26 1.99307 24.0568 0 21.6667 0ZM23.8333 15.5556C23.8333 16.7778 22.8583 17.7778 21.6667 17.7778H4.33333C3.14167 17.7778 2.16667 16.7778 2.16667 15.5556V7.15645L10.6032 13.2138C11.2752 13.6964 12.1368 13.9377 13.0001 13.9377C13.8617 13.9377 14.725 13.6964 15.3969 13.2138L23.8335 7.15645L23.8333 15.5556ZM14.1544 11.3941C13.5501 11.8281 12.4498 11.8281 11.8472 11.3941L2.16658 4.44431C2.16658 3.22209 3.14158 2.22209 4.33325 2.22209H21.6666C22.8582 2.22209 23.8332 3.22209 23.8332 4.44431L14.1544 11.3941Z" fill="#474555"/>
                            </svg>

                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-8 offset-md-2 col-xl-6 offset-xl-3">
                        <button
                          className="primary-button"
                          data-is-sending={this.state.isSending}
                        >
                          Gönder
                        </button>
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
