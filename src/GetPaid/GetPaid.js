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
      processList: [],
      doctorList: [],
      selectedProcess:[],
      selectedDoctor:[],
      total: '',
      discountNumber:'',
      discountResult: '',
      alinanMiktar:'',
      alinanMiktarView: false,
      balance: 0,
    }
  }

  componentDidMount = () => {
    scrollToTop();
    this.props.headerTitleSet(this.props.translate('payments'));
    this.getData()
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
  getData = ()=>{
    API.get(`Process/List`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.props.pageLoadingSet(false);
    })
    .catch((err) => {
      alert(err.response.data.value)
      this.props.pageLoadingSet(false);
    });
    API.get(`Account/ListAllDoctors`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      const doctorList = [];
      res.data.data.map((e)=>{
        doctorList.push({
          id: e.user.id,
          label: e.user.fullName,
        })
      })
      this.setState({
        doctorList
      })
      this.props.pageLoadingSet(false);
    })
    .catch((err) => {
      alert(err.response.data.value)
      this.props.pageLoadingSet(false);
    });
    if (
      this.props.match.params.id !== "" &&
      !_.isUndefined(this.props.match.params.id)
    ) {
      this.props.pageLoadingSet(true);

      API.get(`Account/GetById?id=${this.props.match.params.id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          const { user } = res.data;
          this.setState({
            name: user.fullName,
            tckn: user.identityNumber,
            passionNo: user.id,
            phone: user.phoneNumber,
            email: user.email,
          });
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          alert(err.response.data.value)
          this.props.pageLoadingSet(false);
        });
      API.get(`Dashboard/Home?passionId=${this.props.match.params.id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          const { creditTotal, debtTotal } = res.data;
          this.setState({
            balance: debtTotal - creditTotal + " TL",
          });
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          alert(err.response.data.value);
          this.props.pageLoadingSet(false);
        });
    }

    if (
      this.props.match.params.paid !== "" &&
      !_.isUndefined(this.props.match.params.paid)
    ) {
      this.props.pageLoadingSet(true);

      API.get(`Payment/GetById?id=${this.props.match.params.paid}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.setState({
            total: res.data.price,
            discountNumber:res.data.discountRate,
            discountResult: Number(res.data.price) - (Number(res.data.price) * Number(res.data.discountRate/100)).toFixed(2),
            alinanMiktar:res.data.amount,
            alinanMiktarView:  false,
            selectedProcess:[{id:'1', label:'a1'}],
            selectedDoctor:[{id:res.data.doctor.id, label:res.data.doctor.fullName}],
          })
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          alert(err.response.data.value);
          this.props.pageLoadingSet(false);
        });
    }
  }
  postData = (q) =>{
    if (q==='miktar') {
      this.setState({
        alinanMiktarView:true
      })
    }
  }
  save = ()=>{
    this.postData();
  }
  saveAndFatura = ()=>{
    this.postData('miktar');
  }
  render() {
    return (
      <div className="Payments">
        <div className="row  mt-5">
          <div className="col-md-4 mb-4">
            <div className="border-radius border rounded">
              <div className="card-title">Hasta Kartı</div>
              <div className="card-body">
                <p>
                  {this.state.name}
                  <br />
                  T.C. : {this.state.tckn}
                </p>
                <p>
                  Hasta No:
                  <br />
                  {this.state.passionNo}
                </p>
                <p>
                  Telefon:
                  <br /> {this.state.phone}
                </p>
                <p>
                  E-posta:
                  <br />
                  {this.state.email}
                </p>
                <div className="card-balance mt-5">
                  <p className="text-white p-0 m-0 font-weight-bold fs-16">
                    {this.state.balance}
                  </p>
                  <span className="text-white fs-12">Bakiye</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 mb-4">
            {!this.state.alinanMiktarView && (
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <div className="top-item select-box">
                        <SelectWLabel
                          name="selectedProcess"
                          id="selectedProcess"
                          label="Tedavi"
                          value={this.state.selectedProcess}
                          setValue={(selected) =>
                            this.setState({ selectedProcess: selected })
                          }
                          placeholder="Tedavi Adı"
                          options={[
                            {
                              id: '1',
                              label: 'a1',
                            },
                            {
                              id: '2',
                              label: 'a2',
                            },
                            {
                              id: '3',
                              label: 'a3',
                            },
                            {
                              id: '3',
                              label: 'a3',
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mt-2">
                      <div className="top-item select-box">
                        <SelectWLabel
                          name="selectedDoctor"
                          id="selectedDoctor"
                          label="Doktor"
                          setValue={(selected) => {
                            console.log(selected);
                            this.setState({
                              selectedDoctor: selected,
                            });
                          }}
                          placeholder="Doktor"
                          options={this.state.doctorList}
                          value={this.state.selectedDoctor}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                        type="text"
                        name="total"
                        id="total"
                        label="Toplam Fatura Tutarı"
                        placeholder="Toplam Fatura Tutarı"
                        value={this.state.total}
                        setValue={this.handleChange}
                        inputRef={this.totalRef}
                        tabIndex={1}
                        errorMessage={this.state.errorMessage}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                        type="discount"
                        name="discountNumber"
                        id="discountNumber"
                        label="İndirim Oranı"
                        placeholder="İndirim Oranı"
                        value={this.state.discountNumber}
                        setValue={this.handleChange}
                        inputRef={this.discountNumberRef}
                        tabIndex={1}
                        errorMessage={this.state.errorMessage}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                        type="text"
                        name="discountResult"
                        id="discountResult"
                        label="İndirimli Fatura Tutarı"
                        placeholder="İndirimli Fatura Tutarı"
                        value={this.state.discountResult}
                        setValue={this.handleChange}
                        inputRef={this.discountResultRef}
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
                        onClick={() => this.saveAndFatura()}
                      >
                        Onayla ve Miktar Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.alinanMiktarView && (
              <div className="row">
                <div className="col-md-6 mt-2">
                  <InputWLabel
                    type="text"
                    name="alinanMiktar"
                    id="alinanMiktar"
                    label="Alınan Miktar"
                    placeholder="Alınan Miktar"
                    value={this.state.alinanMiktar}
                    setValue={this.handleChange}
                    inputRef={this.alinanMiktarRef}
                    tabIndex={1}
                    errorMessage={this.state.errorMessage}
                  />
                </div>
                <div className="col-md-12">
                  <button
                    className="primary-button d-inline-flex"
                    onClick={() => this.save()}
                  >
                    Onayla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GetPaid
