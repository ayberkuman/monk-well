import _ from 'lodash';
import moment from "moment";
import React, { Component } from "react";
import { alert } from "../App/appActions";
import { authRoutes } from "../App/routes";
import API, { headers } from "../utils/API";
import InputWLabel from "../utils/components/InputWLabel";
import SelectWLabel from "../utils/components/SelectWLabel";
import { formatMoney, scrollToTop } from "../utils/helper";
export class CreatePaid extends Component {
  constructor(props){
    super(props)
    this.state={
      processList: [],
      doctorList: [],
      selectedProcess:[],
      selectedDoctor:[],
      total: '',
      totalError: '',
      selectedProcessError: '',
      selectedDoctorError: '',
      discountNumber:'',
      discountResult: '',
      alinanMiktar:'',
      alinanMiktarView: false,
      balance: 0,
    }
  }

  componentDidMount = () => {
    scrollToTop();
    setTimeout(() => {
      this.props.headerTitleSet(this.props.translate('payments'));
    }, 400);
    this.getData();
    if (this.props.match.url === authRoutes.addPaid.links[this.props.lang].replace(
      ":id",
      this.props.match.params.id
    )) {
      this.setState({alinanMiktarView: true})
    }
  }

  componentWillUnmount () {
    clearTimeout(this._loadRowsTimeout)
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    
    this.setState({ [name]: value }, () => {
      if (name === 'discountNumber' || name === 'total') {
        if (this.state.total !== "" || this.state.discountNumber !== "") {
          this.setState({
            discountResult:
              Number(this.state.total) -
              Number(this.state.total) *
                Number(this.state.discountNumber / 100),
          });
        } else {
          this.setState({
            discountResult: "",
          });
        }
      }
    });
  };
  getData = ()=>{
    API.get(`Diagnose/ListPrice?length=1000`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      console.log(res.data.data)
      const processList = [];
      res.data.data.map((e)=>{
        processList.push({
          id: e.diagnose.id,
          label: e.diagnose.name,
          price: e.price,
        })
      })
      this.setState({
        processList,
      },()=>{
        if (
          this.props.match.params.paid !== "" &&
          !_.isUndefined(this.props.match.params.paid)
        ) {
          this.editOnly()
        }
      });
      
      this.props.pageLoadingSet(false);
    })
    .catch((err) => {
      // alert(err.response.data.value)
      this.props.pageLoadingSet(false);
    });
    API.get(`Account/ListAllDoctors?length=1000`, {
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
      // alert(err.response.data.value)
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
          // alert(err.response.data.value)
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
            balance: debtTotal - creditTotal,
          });
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          this.props.pageLoadingSet(false);
        });
    }
    
  }
  search = (nameKey, myArray) => {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].id === nameKey) {
            return myArray[i];
        }
    }
}

  editOnly = () => {
    this.props.pageLoadingSet(true);
      console.log('duzenle')
      API.get(`Payment/GetById?id=${this.props.match.params.paid}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res.data.doctorId);

          const process = this.search(res.data.processId, this.state.processList);

          this.setState({
            total: res.data.price,
            discountNumber:res.data.discountRate === 0 ? '' : res.data.discountRate,
            discountResult: res.data.discountRate === 0 ? '' : res.data.amount,
            alinanMiktar:res.data.amount,
            alinanMiktarView:  false,
            selectedProcess:[process],
            selectedDoctor:[{id:res.data.doctor.id, label:res.data.doctor.fullName}],
          })
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          this.props.pageLoadingSet(false);
        });
  }

  postData = (q, r) =>{
    const {total, discountNumber, selectedProcess, selectedDoctor, alinanMiktar} = this.state;
    this.setState(
      {
        totalError: total === ''
          ? "Toplam fatura tutarını giriniz"
          : "",
        selectedProcessError: selectedProcess.length === 0 ? "Lütfen tedavi adını giriniz" : '',
        selectedDoctorError: selectedDoctor.length === 0 ? "Lütfen doktor adını giriniz" : '',
      },
      () => {
        const {totalError, selectedProcessError, selectedDoctorError} = this.state;
        if (q !== "miktar") {
          if (
            totalError === "" &&
            selectedProcessError === "" &&
            selectedDoctorError === ""
          ) {
            const data = {
              userId: this.props.match.params.id,
              price: parseFloat(total),
              discountRate:
                discountNumber === "" ? 0 : parseFloat(discountNumber),
              createDate: moment().format("YYYY-MM-DD"),
              processId: parseInt(selectedProcess[0].id),
              paymentType: 0,
              doctorId: selectedDoctor[0].id,
            };

            if (this.props.match.params.paid !== "" && !_.isUndefined(this.props.match.params.paid)) {
              data.id = parseInt(this.props.match.params.paid)
            }
            this.props.pageLoadingSet(true);
            API.post("Payment", data, {
              headers: {
                ...headers,
                Authorization: `Bearer ${this.props.user.token}`,
              },
            })
              .then((res) => {
                this.props.pageLoadingSet(false);
                if (r === "next") {
                  this.setState({
                    alinanMiktarView: true,
                  });
                } else {
                  this.props.history.push(
                    authRoutes.userDetail.links[this.props.lang].replace(
                      ":id",
                      this.props.match.params.id
                    )
                  );
                }
              })
              .catch((err) => {
                this.props.pageLoadingSet(false);
                this.setState({ isSending: false });
              });
          }
         } else {
            const data = {
              userId: this.props.match.params.id,
              price: parseFloat(alinanMiktar),
              discountRate: 0,
              createDate: moment().format("YYYY-MM-DD"),
              processId: 0,
              paymentType: 10,
              doctorId: "",
              description: "Ödeme alındı",
            };
            this.props.pageLoadingSet(true);
            API.post("Payment", data, {
              headers: {
                ...headers,
                Authorization: `Bearer ${this.props.user.token}`,
              },
            })
              .then((res) => {
                alert(12312);
                this.props.pageLoadingSet(false);
                this.props.history.push(
                  authRoutes.userDetail.links[this.props.lang].replace(
                    ":id",
                    this.props.match.params.id
                  )
                );
              })
              .catch((err) => {
                this.props.pageLoadingSet(false);
                this.setState({ isSending: false });
              });
          }
        }
    );
  }
  save = (redirect)=>{
    this.postData('save', redirect);
  }
  saveAndFatura = ()=>{
    this.postData('miktar', '');
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
                    {formatMoney(this.state.balance) + " TL"}
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
                          setValue={(selected) =>{
                            this.setState({ 
                              selectedProcess: selected, total: !_.isUndefined(selected[0]) ? selected[0].price : '',
                              discountResult:
                              !_.isUndefined(selected[0]) ?
                              Number(selected[0].price) -
                              Number(selected[0].price) *
                                Number(this.state.discountNumber / 100) : '',
                            })
                          }
                          }
                          placeholder="Tedavi Adı"
                          options={this.state.processList}
                          errorMessage={this.state.selectedProcessError}
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
                            this.setState({
                              selectedDoctor: selected,
                            });
                          }}
                          placeholder="Doktor"
                          options={this.state.doctorList}
                          value={this.state.selectedDoctor}
                          errorMessage={this.state.selectedDoctorError}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                      classes='mt-3'
                        type="text"
                        name="total"
                        id="total"
                        label="Toplam Fatura Tutarı"
                        placeholder="Toplam Fatura Tutarı"
                        value={this.state.total}
                        setValue={this.handleChange}
                        inputRef={this.totalRef}
                        tabIndex={1}
                        errorMessage={this.state.totalError}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                      classes='mt-3'
                        type="discount"
                        name="discountNumber"
                        id="discountNumber"
                        label="İndirim Oranı"
                        placeholder="İndirim Oranı"
                        value={this.state.discountNumber}
                        setValue={this.handleChange}
                        inputRef={this.discountNumberRef}
                        tabIndex={1}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                      classes='mt-3'
                        type="text"
                        name="discountResult"
                        id="discountResult"
                        label="İndirimli Fatura Tutarı"
                        placeholder="İndirimli Fatura Tutarı"
                        value={this.state.discountNumber=== '' ? '' : this.state.discountResult}
                        setValue={this.handleChange}
                        inputRef={this.discountResultRef}
                        tabIndex={1}
                        disabled
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
                        onClick={() => this.save("next")}
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
                  classes='mt-3'
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
                    onClick={() => this.saveAndFatura()}
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

export default CreatePaid
