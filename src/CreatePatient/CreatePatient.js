import React, { Component } from "react";
import InputWLabel from "../utils/components/InputWLabel";
import { scrollToTop } from "../utils/helper";
import API, { headers } from "../utils/API";
import { authRoutes } from "../App/routes";
import { validateInput } from "../utils/helper";
export class CreatePatient extends Component {
  constructor(props){
    super(props)
    this.state={
      tckn: '',
      nameSurname: '',
      eMail: '',
      phoneNumber: '',
      address: '',
      tcknError: '',
      nameSurnameError: '',
      eMailError: '',
      phoneNumberError: '',
      addressError: '',
    }
  }

  componentDidMount = () => {
    scrollToTop();
    this.props.headerTitleSet(this.props.translate('payments'));
  }

  componentWillUnmount () {
    clearTimeout(this._loadRowsTimeout)
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      setTimeout(this.handleCheck, 20);
    });
  };
  handleCheck = () => {
  };
  postData = (redirect) =>{
    const { tckn, nameSurname, eMail, phoneNumber, address} = this.state;
    this.setState({
      tcknError: !validateInput('tckn', tckn) ? 'Geçerli bir TCKN numarası giriniz' : '',
      nameSurnameError: nameSurname === '' ? 'Lütfen adınızı soyadınızı giriniz' : '',
      eMailError: !validateInput('email', eMail) ? 'Geçerli bir e-posta adresi giriniz' : '',
      phoneNumberError: !validateInput('tel', phoneNumber) ? 'Geçerli bir telefon numarası giriniz' : '',
      addressError: address === '' ? 'Lütfen adresinizi giriniz' : '',
    },() => {
      const { tcknError, nameSurnameError, eMailError, phoneNumberError, addressError } = this.state;
      console.log(tcknError, nameSurnameError, eMailError, phoneNumberError, addressError)
      if (
        tcknError === "" &&
        nameSurnameError === "" &&
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
            fullName: nameSurname,
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
              this.props.history.push(authRoutes.getPaid.links[this.props.lang].replace(":id", res.data.id));
            }
            else{
              this.props.history.push(authRoutes.payments.links[this.props.lang]);
            }
          })
          .catch((err) => {
            this.props.pageLoadingSet(false);
          });
      }
    })
   
  }
  save = ()=>{
    this.postData();
  }
  saveAndPay = ()=>{
    this.postData('pay');
  }
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
              type="text"
              name="tckn"
              id="tckn"
              label="T.C. Kimlik Numarası"
              placeholder="T.C. Kimlik Numarası"
              value={this.state.tckn}
              setValue={this.handleChange}
              inputRef={this.tcknRef}
              tabIndex={1}
              errorMessage={this.state.tcknError}
              maxLength={11}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
              type="text"
              name="nameSurname"
              id="nameSurname"
              label="Ad Soyad"
              placeholder="Ad Soyad"
              value={this.state.nameSurname}
              setValue={this.handleChange}
              inputRef={this.nameSurnameRef}
              tabIndex={1}
              errorMessage={this.state.nameSurnameError}
            />
          </div>
          <div className="col-md-4 mt-2">
            <InputWLabel
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
          <div className="col-md-8 mt-2">
            <InputWLabel
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
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <button className="primary-button d-inline-flex"
            onClick={()=>this.save()}>
              Kayıt Al
            </button>
            <button className="primary-white-button d-inline-flex ml-4"
            onClick={()=>this.saveAndPay()}>
              Kayıt Al ve Ödeme Al
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePatient
