import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { authRoutes } from "../App/routes";
import API, { headers } from "../utils/API";
import InputWLabel from "../utils/components/InputWLabel";
import { currency, formatMoney, scrollToTop } from "../utils/helper";

export class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      hasMore: false,
      length: 10,
      currentpage: 1,
      search: "",
    };
  }

  componentDidMount = () => {
    scrollToTop();
    setTimeout(() => {
      this.props.headerTitleSet(this.props.translate("payments"));
    }, 400);
    this.getData();
  };

  getData = () => {
    if (this.state.search === "") {
      // this.props.pageLoadingSet(true)
    }
    API.get(
      `Payment/ListByPassion?searchBy=${this.state.search}&currentpage=${this.state.currentpage}`,
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
          page: this.state.currentpage,
        },
      }
    )
      .then((res) => {
        // this.props.pageLoadingSet(false);
        const { data } = res;
        const rows = this.state.rows;
        data.data.map((e) => {
          rows.push({
            id: e.user.id,
            fullName: e.user.fullName,
            totalBalance: e.totalBalance,
            totalCredit: e.totalCredit,
            totalDebt: e.totalDebt,
            currency: currency(e.currency),
          });
        });
        this.setState({
          currentpage: this.state.currentpage + 1,
          rows: rows,
          hasMore: data.totalPages >= this.state.currentpage + 1,
        });
      })
      .catch((err) => {
        // alert(err.response.data.value)
        // this.props.pageLoadingSet(false);
      });
  };

  timeout = "";
  handleChange = (e) => {
    const { value } = e.target;
    clearTimeout(this.timeout);

    this.setState(
      {
        rows: [],
        search: value,
        currentpage: 1,
      },
      () => {
        this.timeout = setTimeout(() => {
          this.getData();
        }, 500);
      }
    );
  };
  render() {
    return (
      <div className="Payments">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <Link
                className="primary-button d-inline-flex"
                to={authRoutes.createPatient.links[this.props.lang]}
              >
                Hasta Kaydı Oluştur
              </Link>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <InputWLabel
                name="search"
                type="searchT"
                classes="mb-0 mw-400 w-100"
                id="search"
                value={this.state.search}
                setValue={this.handleChange}
                tabIndex={1}
                label=""
                placeholder="Hasta Adı"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.6672 18.1075L14.7625 13.1963C17.2288 9.98675 16.9826 5.34958 14.0229 2.41441C12.4065 0.796245 10.3234 0 8.21364 0C6.10387 0 4.02067 0.795147 2.40443 2.41441C-0.801477 5.62392 -0.801477 10.8364 2.40443 14.0459C4.02078 15.6641 6.10387 16.4603 8.21364 16.4603C9.96701 16.4603 11.7215 15.9116 13.1742 14.7864L18.1057 19.671C18.3251 19.8907 18.5991 20 18.8999 20C19.174 20 19.4758 19.8907 19.6942 19.671C20.1063 19.2595 20.1063 18.5458 19.6674 18.1075H19.6672ZM8.24028 14.2387C6.62393 14.2387 5.14344 13.6075 3.99278 12.4834C1.6635 10.1515 1.6635 6.33874 3.99278 3.97886C5.11675 2.85363 6.62393 2.22353 8.24028 2.22353C9.85663 2.22353 11.3371 2.85473 12.4878 3.97886C13.6385 5.1041 14.2412 6.61297 14.2412 8.23114C14.2412 9.84931 13.6107 11.3315 12.4878 12.4834C11.3638 13.6354 9.82989 14.2387 8.24028 14.2387Z"
                      fill="#474555"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
        <div>
          <InfiniteScroll
            dataLength={this.state.rows.length}
            next={this.getData}
            hasMore={this.state.hasMore}
            loader={
              <tr>
                <td>...</td>
              </tr>
            }
            height={600}
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
                    <th className="react-infinite-table-col-0">Hasta Adı</th>
                    <th className="react-infinite-table-col-1">
                      Fatura Tutarı
                    </th>
                    <th className="react-infinite-table-col-2">
                      Tahsil Edilmiş
                    </th>
                    <th className="react-infinite-table-col-3">Açık Bakiye</th>
                    <th className="react-infinite-table-col-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((i, index) => (
                    <tr key={index + "a"}>
                      <td className="react-infinite-table-col-0">
                        <Link
                          className="d-block"
                          to={authRoutes.userDetail.links[
                            this.props.lang
                          ].replace(":id", i.id)}
                        >
                          {i.fullName}
                        </Link>
                      </td>
                      <td className="react-infinite-table-col-1">
                        <Link
                          className="d-block"
                          to={authRoutes.userDetail.links[
                            this.props.lang
                          ].replace(":id", i.id)}
                        >
                          {formatMoney(i.totalDebt)}
                        </Link>
                      </td>
                      <td className="react-infinite-table-col-2">
                        <Link
                          className="d-block"
                          to={authRoutes.userDetail.links[
                            this.props.lang
                          ].replace(":id", i.id)}
                        >
                          {formatMoney(i.totalCredit)}
                        </Link>
                      </td>
                      <td className="react-infinite-table-col-3">
                        <Link
                          className="d-block"
                          to={authRoutes.userDetail.links[
                            this.props.lang
                          ].replace(":id", i.id)}
                        >
                          {formatMoney(i.totalBalance)}
                        </Link>
                      </td>
                      <td className="react-infinite-table-col-4 text-right">
                        <div className="d-flex justify-content-end">
                          <Link
                            className="primary-button md d-inline-flex min-110 mr-2"
                            to={authRoutes.addTreatment.links[
                              this.props.lang
                            ].replace(":id", i.id)}
                          >
                            Tedavi Ekle
                          </Link>
                          <Link
                            className="primary-button md d-inline-flex min-110"
                            to={authRoutes.addPaid.links[
                              this.props.lang
                            ].replace(":id", i.id)}
                          >
                            Ödeme Al
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default Payments;
