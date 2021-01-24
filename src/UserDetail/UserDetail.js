import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import API, { headers } from "../utils/API";
import { headerTitleSet } from "../App/appActions";
import { formatMoney, scrollToTop } from "../utils/helper";
import editIcon from '../assets/images/edit-icon.svg';
import deleteIcon from '../assets/images/delete-icon.svg';
import { authRoutes } from "../App/routes";

export class UserDetail extends Component {
  constructor(props){
    super(props)
    this.state={
      name: '',
      tckn: '',
      passionNo: '',
      phone: '',
      email: '',
      balance: '',
      yapilanIslemler: [],
      yapilanIslemlerToplam: 0,
      islemGecmisi:[],
      islemGecmisiToplam: 0,
      hasMore1: false,
      hasMore2: false, 
      length1: 10,
      length2: 10,
      currentpage1: 1,
      currentpage2: 1,
    }
  }
  componentDidMount = () => {
    scrollToTop();

    this.getData()
  }
  getData = ()=>{
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
          const { creditTotal, debtTotal, list } = res.data;
          const yapilanIslemler = [];
          let yapilanIslemlerToplam = 0;
          const islemGecmisi = [];
          let islemGecmisiToplam = 0;
          list.map((e) => {
            if (e.paymentType === 0) {
              islemGecmisi.push({
                description: e.description,
                price: e.price,
                doctorId: e.doctorId,
                userId: e.userId,
                id: e.id,
              });
              islemGecmisiToplam = islemGecmisiToplam + e.price;
            } else{
              yapilanIslemler.push({
                description: e.description,
                price: e.price,
                doctorId: e.doctorId,
                userId: e.userId,
                id: e.id,
              });
              yapilanIslemlerToplam = yapilanIslemlerToplam + e.price;
            }
          });
          this.setState({
            balance: debtTotal - creditTotal,
            islemGecmisi,
            islemGecmisiToplam,
            yapilanIslemler,
            yapilanIslemlerToplam,
          });
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          alert(err.response.data.value)
          this.props.pageLoadingSet(false);
        });
    }
  }

  payDelete = (id) => {
    this.props.pageLoadingSet(true);
    API.delete(`Payment?paymentId=${id}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    })
      .then((res) => {
        this.getData()
        this.props.pageLoadingSet(false);
      })
      .catch((err) => {
        this.props.pageLoadingSet(false);
      });
  }
    
  render() {
    return (
      <div className="Payments">
        <div className="row pt-4">
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
                <div className="card-balance">
                  <p className="text-white p-0 m-0 font-weight-bold fs-16">
                    {formatMoney(this.state.balance) + ' TL'}
                  </p>
                  <span className="text-white fs-12">Bakiye</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <InfiniteScroll
              dataLength={this.state.yapilanIslemler.length}
              next={this.getData}
              hasMore={this.state.hasMore1}
              loader={
                <tr>
                  <td>Loading...</td>
                </tr>
              }
              height={385}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  {/*<b>Yay! You have seen it all</b>*/}
                </p>
              }
            >
              <div className="react-infinite-table react-infinite-table-fill example-table">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="react-infinite-table-col-0">
                        Yapılan İşlemler
                      </th>
                      <th className="react-infinite-table-col-1 text-right">
                        Toplam : {formatMoney(this.state.yapilanIslemlerToplam)} TL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.yapilanIslemler.map((i, index) => (
                      <tr key={index + "a"}>
                        <td className="react-infinite-table-col-0">
                          {i.description}
                        </td>
                        <td
                          className="react-infinite-table-col-1"
                          align="right"
                        >
                          {formatMoney(i.price)} TL
                          <Dropdown className="float-right dropdown-min">
                            <Dropdown.Toggle></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  this.props.history.push(
                                    authRoutes.editPaid.links[this.props.lang]
                                      .replace(
                                        ":id",
                                        this.props.match.params.id
                                      )
                                      .replace(":paid", i.id)
                                  )
                                }
                              >
                                <img src={editIcon} alt="" className="mr-2" />{" "}
                                Düzenle
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.payDelete(i.id);
                                }}
                              >
                                <img src={deleteIcon} alt="" className="mr-2" />{" "}
                                Sil
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfiniteScroll>
            <Link
              className="primary-button d-inline-flex mt-3"
              to={authRoutes.getPaid.links[this.props.lang].replace(
                ":id",
                this.props.match.params.id
              )}
            >
              Tedavi Ekle
            </Link>
          </div>
          <div className="col-md-4 mb-4">
            <InfiniteScroll
              dataLength={this.state.islemGecmisi.length}
              next={this.getData}
              hasMore={this.state.hasMore2}
              loader={
                <tr>
                  <td>Loading...</td>
                </tr>
              }
              height={385}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  {/*<b>Yay! You have seen it all</b>*/}
                </p>
              }
            >
              <div className="react-infinite-table react-infinite-table-fill example-table">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="react-infinite-table-col-0">
                        İşlem Geçmisi
                      </th>
                      <th className="react-infinite-table-col-1 text-right">
                        Toplam : {formatMoney(this.state.islemGecmisiToplam)} TL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.islemGecmisi.map((i, index) => (
                      <tr key={index + "a"}>
                        <td className="react-infinite-table-col-0">
                          {i.description}
                        </td>
                        <td
                          className="react-infinite-table-col-1"
                          align="right"
                        >
                          {formatMoney(i.price)} TL
                          <Dropdown className="float-right dropdown-min">
                            <Dropdown.Toggle></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  this.props.history.push(
                                    authRoutes.editPaid.links[this.props.lang]
                                      .replace(
                                        ":id",
                                        this.props.match.params.id
                                      )
                                      .replace(":paid", i.id)
                                  )
                                }
                              >
                                <img src={editIcon} alt="" className="mr-2" />{" "}
                                Düzenle
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.payDelete(i.id);
                                }}
                              >
                                <img src={deleteIcon} alt="" className="mr-2" />{" "}
                                Sil
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfiniteScroll>
            <Link
              className="primary-button d-inline-flex mt-3"
              to={authRoutes.getPaid.links[this.props.lang].replace(
                ":id",
                this.props.match.params.id
              )}
            >
              Ödeme Al
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail
