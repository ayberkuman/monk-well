import React, { Component } from "react";
import _ from 'lodash';
import InputWLabel from "../utils/components/InputWLabel";
import SelectWLabel from "../utils/components/SelectWLabel";
import { scrollToTop } from "../utils/helper";
import API, { headers } from "../utils/API";
export class GetPaid extends Component {
  constructor(props){
    super(props)
    this.state={
      selectedProcess:'',
      tckn: '',
      nameSurname: '',
      eMail: '',
      phoneNumber: '',
      address: '',
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
    this.props.pageLoadingSet(true);
    const { tckn, nameSurname, eMail, phoneNumber, address } = this.state;
    const data = {
      createdUser: {
        id: tckn,
        normalizedUserName: "string",
        email: eMail,
        phoneNumber,
        fullName: nameSurname,
        address
      },
    };
    console.log('00000');
    API.post("Payment", data, { headers: { ...headers, Authorization: `Bearer ${this.props.user.token}` } })
      .then((res) => {
        this.props.pageLoadingSet(false);
        console.log(1);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(2);
        console.log(err);
        this.props.pageLoadingSet(false);
      });
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
        <div className="row  mt-5">
          <div className="col-md-4"></div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 mt-2">
                <div className="top-item select-box">
                  <SelectWLabel
                    name="selectedProcess"
                    id="selectedProcess"
                    label="Tedavi Adı"
                    value={String(this.state.selectedProcess)}
                    setValue={e =>
                      this.setState({ selectedProcess: e[0].label })
                    }
                    placeholder='Tedavi Adı'
                    options={[{
                      label: 'Alabama',
                      population: 4780127,
                      capital: 'Montgomery',
                      region: 'South',
                    },
                    { label: 'Alaska', population: 710249, capital: 'Juneau', region: 'West' },
                    { label: 'Arizona', population: 6392307, capital: 'Phoenix', region: 'West' },
                    {
                      label: 'Arkansas',
                      population: 2915958,
                      capital: 'Little Rock',
                      region: 'South',
                    }]}
                  />
                </div>
              </div>

              <div className="col-md-6 mt-2">
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
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
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
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
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
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
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
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <hr className="mt-0 mb-4"></hr>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
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
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <button
                  className="primary-button d-inline-flex"
                  onClick={() => this.save()}
                >
                  Onayla
                </button>
                <button
                  className="primary-white-button d-inline-flex ml-4"
                  onClick={() => this.saveAndPay()}
                >
                  Onayla ve Ödeme Al
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetPaid
