import React, { Component } from "react";
import InputWLabel from "../utils/components/InputWLabel";
import { scrollToTop } from "../utils/helper";
import API, { headers } from "../utils/API";
import { authRoutes } from "../App/routes";
import { validateInput } from "../utils/helper";
export class CreatePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tckn: "",
      firstName: "",
      lastName: "",
      eMail: "",
      phoneNumber: "",
      address: "",
      tcknError: "",
      firstError: "",
      lastError: "",
      eMailError: "",
      phoneNumberError: "",
      addressError: "",
    };
  }

  componentDidMount = () => {
    scrollToTop();
    setTimeout(() => {
      this.props.headerTitleSet(this.props.translate("payments"));
    }, 400);
  };

  componentWillUnmount() {
    clearTimeout(this._loadRowsTimeout);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      var val = value.replace(/^[\d\(\)\+]+$/m, "");
      if (val === "") {
        this.setState({ [name]: value }, () => {
          setTimeout(this.handleCheck, 20);
        });
      }
    } else {
      this.setState({ [name]: value }, () => {
        setTimeout(this.handleCheck, 20);
      });
    }
  };

  handleCheck = () => {};
  postData = (redirect) => {
    const { tckn, firstName, lastName, eMail, phoneNumber, address } =
      this.state;
    this.setState(
      {
        tcknError: tckn === "" ? "Geçerli bir TCKN numarası giriniz" : "",
        firstNameError: firstName === "" ? "Lütfen adınızı giriniz" : "",
        lastNameError: lastName === "" ? "Lütfen soyadınızı giriniz" : "",
        eMailError: !validateInput("email", eMail)
          ? "Geçerli bir e-posta adresi giriniz"
          : "",
        phoneNumberError: !validateInput("tel", phoneNumber)
          ? "Geçerli bir telefon numarası giriniz"
          : "",
        addressError: address === "" ? "Lütfen adresinizi giriniz" : "",
      },
      () => {
        const {
          tcknError,
          firstNameError,
          lastNameError,
          eMailError,
          phoneNumberError,
          addressError,
        } = this.state;
        if (
          tcknError === "" &&
          firstNameError === "" &&
          lastNameError === "" &&
          eMailError === "" &&
          phoneNumberError === "" &&
          addressError === ""
        ) {
          this.props.pageLoadingSet(true);
          const data = {
            user: {
              identityNumber: tckn,
              email: eMail,
              phoneNumber: phoneNumber,
              firstName,
              lastName,
              address: address,
            },
          };

          API.post("/Account/Addpassion", data, {
            headers: {
              ...headers,
              Authorization: `Bearer ${this.props.user.token}`,
            },
          })
            .then((res) => {
              this.props.pageLoadingSet(false);
              if (redirect === "pay") {
                this.props.history.push(
                  authRoutes.addTreatment.links[this.props.lang].replace(
                    ":id",
                    res.data.id
                  )
                );
              } else {
                this.props.history.push(
                  authRoutes.payments.links[this.props.lang]
                );
              }
            })
            .catch((err) => {
              this.props.pageLoadingSet(false);
              if (err.response.data.errors.Email) {
                alert(err.response.data.errors.Email[0]);
              }
              if (err.response.data.errors.IdentityNumber) {
                alert(err.response.data.errors.IdentityNumber[0]);
              }
              if (err.response.data.errors.PhoneNumber) {
                alert(err.response.data.errors.PhoneNumber[0]);
              }
            });
        }
      }
    );
  };
  save = () => {
    this.postData();
  };
  saveAndPay = () => {
    this.postData("pay");
  };
  render() {
    return (
      <div className="Payments">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-12 mb-2">
              <h1>Kayıt Oluşturma</h1>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 mt-2">
            <InputWLabel
              classes="mt-3"
              type="text"
              name="tckn"
              id="tckn"
              label="Kimlik Numarası"
              placeholder="Kimlik Numarası"
              value={this.state.tckn}
              setValue={this.handleChange}
              inputRef={this.tcknRef}
              tabIndex={1}
              errorMessage={this.state.tcknError}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
              classes="mt-3"
              type="text"
              name="firstName"
              id="firstName"
              label="Ad"
              placeholder="Ad"
              value={this.state.firstName}
              setValue={this.handleChange}
              inputRef={this.firstNameRef}
              tabIndex={1}
              errorMessage={this.state.firstNameError}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
              classes="mt-3"
              type="text"
              name="lastName"
              id="lastName"
              label="Soyad"
              placeholder="Soyad"
              value={this.state.lastName}
              setValue={this.handleChange}
              inputRef={this.lastNameRef}
              tabIndex={1}
              errorMessage={this.state.lastNameError}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
              classes="mt-3"
              type="email"
              name="eMail"
              id="eMail"
              label="E-posta"
              placeholder="E-posta"
              value={this.state.eMail}
              setValue={this.handleChange}
              inputRef={this.eMailRef}
              tabIndex={1}
              errorMessage={this.state.eMailError}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
              classes="mt-3"
              type="phone"
              name="phoneNumber"
              id="phoneNumber"
              label="Telefon"
              placeholder="Telefon"
              value={this.state.phoneNumber}
              setValue={this.handleChange}
              inputRef={this.phoneNumberRef}
              tabIndex={1}
              errorMessage={this.state.phoneNumberError}
            />
          </div>
          {/* <div className="col-md-8 mt-2">
            <InputWLabel
              classes="mt-3"
              type="text"
              name="address"
              id="address"
              label="Adres"
              placeholder="Adres"
              value={this.state.address}
              setValue={this.handleChange}
              inputRef={this.addressRef}
              tabIndex={1}
              errorMessage={this.state.addressError}
            />
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              className="primary-button d-inline-flex"
              onClick={() => this.save()}
            >
              Kayıt Al
            </button>
            <button
              className="primary-white-button d-inline-flex ml-4"
              onClick={() => this.saveAndPay()}
            >
              Kayıt Al ve Ödeme Al
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePatient;
