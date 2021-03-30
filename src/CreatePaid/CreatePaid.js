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
      discountType: 'rate',
      editable: true,
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
          if (this.state.discountType === 'rate') {
            if (
              Number(this.state.total) >=
              Number(this.state.total) * Number(this.state.discountNumber / 100)
            ) {
              this.setState({
                discountResult:
                  Number(this.state.total) -
                  Number(this.state.total) *
                    Number(this.state.discountNumber / 100),
              });
            } else {
              this.setState({
                discountNumber: "",
              });
            }
          } else{
            console.log(Number(this.state.total) - Number(this.state.discountNumber))
            if (
              Number(this.state.total) - Number(this.state.discountNumber) >=
              0
            ) {
              this.setState({
                discountResult:
                  Number(this.state.total) - Number(this.state.discountNumber),
              });
            } else {
              this.setState({
                discountNumber: "",
              });
            }
          }
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
      API.get(`Payment/GetById?id=${this.props.match.params.paid}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          const process = this.search(res.data.processId, this.state.processList);

          this.setState({
            total: res.data.price,
            discountNumber:res.data.discountRate === 0 ? res.data.price - res.data.amount > 0 ? res.data.price - res.data.amount : '' : res.data.discountRate,
            discountResult: res.data.price === res.data.amount ? '' : res.data.amount,
            alinanMiktar:res.data.amount,
            alinanMiktarView:  false,
            selectedProcess:[process],
            selectedDoctor:[{id:res.data.doctor.id, label:res.data.doctor.fullName}],
            discountType: res.data.discountRate>0 ? 'rate' : 'amount'
          })
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          this.props.pageLoadingSet(false);
        });
  }

  postData = (q, r) =>{
    const {total, discountNumber, selectedProcess, selectedDoctor, alinanMiktar, discountType} = this.state;
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
                discountNumber === "" || discountType !== 'rate' ? 0 : parseFloat(discountNumber),
              amount: discountNumber === "" || discountType === 'rate' ? 0 : parseFloat(discountNumber),
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
  discountTypeChange = (discountType)=>{
    this.setState({
      discountType 
    },()=>{
      if (this.state.total !== "" || this.state.discountNumber !== "") {
        if (this.state.discountType === 'rate') {
          if (
            Number(this.state.total) >=
            Number(this.state.total) * Number(this.state.discountNumber / 100)
          ) {
            this.setState({
              discountResult:
                Number(this.state.total) -
                Number(this.state.total) *
                  Number(this.state.discountNumber / 100),
            });
          } else {
            this.setState({
              discountNumber: "",
            });
          }
        } else{
          console.log(Number(this.state.total) - Number(this.state.discountNumber))
          if (
            Number(this.state.total) - Number(this.state.discountNumber) >=
            0
          ) {
            this.setState({
              discountResult:
                Number(this.state.total) - Number(this.state.discountNumber),
            });
          } else {
            this.setState({
              discountNumber: "",
            });
          }
        }
      } else {
        this.setState({
          discountResult: "",
        });
      }
    });
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
                          setValue={(selected) => {
                            this.setState({
                              selectedProcess: selected,
                              total: !_.isUndefined(selected[0])
                                ? selected[0].price
                                : "",
                              discountResult: !_.isUndefined(selected[0])
                                ? Number(selected[0].price) -
                                  Number(selected[0].price) *
                                    Number(this.state.discountNumber / 100)
                                : "",
                            });
                          }}
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
                        classes="mt-3"
                        type="text"
                        name="total"
                        id="total"
                        label="İşlem Ücreti"
                        placeholder="İşlem Ücreti"
                        value={this.state.total}
                        setValue={this.handleChange}
                        inputRef={this.totalRef}
                        tabIndex={1}
                        errorMessage={this.state.totalError}
                        disabled={this.state.editable}
                      />
                      <div
                        className="discount-or-amount"
                        onClick={() => {
                          this.setState({ editable: !this.state.editable });
                        }}
                      >
                        <div
                          className={`discount ${
                            !this.state.editable && "active"
                          }`}
                        >
                          <svg
                            width={20}
                            fill={this.state.editable ? "#7273CD":"#fff"}
                            viewBox="-15 -15 484.00019 484"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m401.648438 18.234375c-24.394532-24.351563-63.898438-24.351563-88.292969 0l-22.101563 22.222656-235.269531 235.144531-.5.503907c-.121094.121093-.121094.25-.25.25-.25.375-.625.746093-.871094 1.121093 0 .125-.128906.125-.128906.25-.25.375-.371094.625-.625 1-.121094.125-.121094.246094-.246094.375-.125.375-.25.625-.378906 1 0 .121094-.121094.121094-.121094.25l-52.199219 156.96875c-1.53125 4.46875-.367187 9.417969 2.996094 12.734376 2.363282 2.332031 5.550782 3.636718 8.867188 3.625 1.355468-.023438 2.699218-.234376 3.996094-.625l156.847656-52.324219c.121094 0 .121094 0 .25-.121094.394531-.117187.773437-.285156 1.121094-.503906.097656-.011719.183593-.054688.253906-.121094.371094-.25.871094-.503906 1.246094-.753906.371093-.246094.75-.621094 1.125-.871094.125-.128906.246093-.128906.246093-.25.128907-.125.378907-.246094.503907-.5l257.371093-257.371094c24.351563-24.394531 24.351563-63.898437 0-88.289062zm-232.273438 353.148437-86.914062-86.910156 217.535156-217.535156 86.914062 86.910156zm-99.15625-63.808593 75.929688 75.925781-114.015626 37.960938zm347.664062-184.820313-13.238281 13.363282-86.917969-86.917969 13.367188-13.359375c14.621094-14.609375 38.320312-14.609375 52.945312 0l33.964844 33.964844c14.511719 14.6875 14.457032 38.332031-.121094 52.949218zm0 0" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                        classes="mt-3"
                        type="discount"
                        name="discountNumber"
                        id="discountNumber"
                        label={
                          this.state.discountType === "rate"
                            ? "İndirim Oranı"
                            : "İndirim Tutarı"
                        }
                        placeholder={
                          this.state.discountType === "rate"
                            ? "İndirim Oranı"
                            : "İndirim Tutarı"
                        }
                        value={this.state.discountNumber}
                        setValue={this.handleChange}
                        inputRef={this.discountNumberRef}
                        tabIndex={1}
                      />
                      <div className="discount-or-amount">
                        <div
                          className={`discount ${
                            this.state.discountType === "rate" && "active"
                          }`}
                          onClick={() => this.discountTypeChange("rate")}
                        >
                          %
                        </div>
                        <div
                          className={`discount ${
                            this.state.discountType === "amount" && "active"
                          }`}
                          onClick={() => this.discountTypeChange("amount")}
                        >
                          ₺
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <InputWLabel
                        classes="mt-3"
                        type="text"
                        name="discountResult"
                        id="discountResult"
                        label="İndirimli Fatura Tutarı"
                        placeholder="İndirimli Fatura Tutarı"
                        value={
                          this.state.discountNumber === ""
                            ? ""
                            : this.state.discountResult
                        }
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
                    classes="mt-3"
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
