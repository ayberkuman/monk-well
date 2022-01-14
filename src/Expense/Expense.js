import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import API, { headers } from "../utils/API";
import { scrollToTop, currency, formatMoney } from "../utils/helper";
import InputWLabel from "../utils/components/InputWLabel";
import { authRoutes } from "../App/routes";
import InfiniteScroll from "react-infinite-scroll-component";
registerLocale("tr", tr);

export class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      hasMore: false,
      length: 10,
      currentpage: 1,
      search: "",
      startDate: "",
      endDate: "",
      totalExpense: "0",
    };
  }

  componentDidMount = () => {
    scrollToTop();
    setTimeout(() => {
      this.props.headerTitleSet(this.props.translate("expenses"));
    }, 400);
    this.getData();
  };

  getData = (type = "empty") => {
    // this.props.pageLoadingSet(true);
    const startDate =
      this.state.startDate !== ""
        ? moment(this.state.startDate).format("YYYY-MM-DD")
        : "";
    const endDate =
      this.state.endDate !== ""
        ? moment(this.state.endDate).format("YYYY-MM-DD")
        : "";
    API.get(
      `Expense/List?searchBy=${this.state.search}&startDate=${startDate}&endDate=${endDate}&page=${this.state.currentpage}`,
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
        const rows = type !== "add" ? [] : this.state.rows;
        if (type !== "add") {
          this.setState({
            currentpage: 1,
          });
        }
        data.data.map((e) => {
          rows.push({
            amount: e.amount,
            clinicId: e.clinicId,
            createDate: e.date,
            currency: e.currency,
            description: e.description,
            id: e.id,
            disabled: true,
            type: "",
          });
        });
        this.setState({
          currentpage: this.state.currentpage + 1,
          rows: rows,
          hasMore: data.totalPages >= this.state.currentpage + 1,
          totalExpense: data.totalExpense,
        });
      })
      .catch((err) => {
        // this.props.pageLoadingSet(false);
      });
  };
  handleChange = (e, index) => {
    const arr = this.state.rows;
    if (!_.isUndefined(e.target)) {
      if (e.target.name.includes("gider")) {
        arr[index].description = e.target.value;
      } else if (e.target.name.includes("tutar")) {
        arr[index].amount = e.target.value;
      }
    } else {
      arr[index].createDate = e;
    }

    this.setState({
      rows: arr,
    });
  };
  addRow = () => {
    const arr = this.state.rows;
    arr.unshift({
      amount: "",
      createDate: new Date(),
      description: "",
      disabled: false,
      type: "new",
    });
    this.setState({
      rows: arr,
    });
  };
  editRow = (x, i) => {
    const arr = this.state.rows;
    arr[i].disabled = false;
    this.setState({
      rows: arr,
    });
  };
  editRowSave = (x, i) => {
    const data = {
      id: this.state.rows[i].id,
      clinicId: this.state.rows[i].clinicId,
      description: this.state.rows[i].description,
      date: moment(this.state.rows[i].createDate).format(),
      amount: _.isNaN(parseFloat(this.state.rows[i].amount))
        ? ""
        : parseFloat(this.state.rows[i].amount),
      currency: this.state.rows[i].currency,
    };

    if (
      data.createDate !== "" &&
      data.description !== "" &&
      data.amount !== ""
    ) {
      this.props.pageLoadingSet(true);
      this.setState(
        {
          rows: [],
        },
        () => {
          API.post("Expense", data, {
            headers: {
              ...headers,
              Authorization: `Bearer ${this.props.user.token}`,
            },
          })
            .then((res) => {
              this.props.pageLoadingSet(false);
              const oldData = this.state.rows;
              oldData.splice(i, 1);
              this.setState({
                rows: oldData,
              });
              this.getData();
            })
            .catch((err) => {
              this.props.pageLoadingSet(false);
              this.setState({ isSending: false });
            });
        }
      );
    } else {
      alert("Lütfen gerekli alanları doldurunuz.");
    }
  };

  delete = (i) => {
    const id = this.state.rows[i].id;
    const arr = this.state.rows;
    if (this.state.rows[i].type === "new") {
      arr.splice(i, 1);
      this.setState({
        rows: arr,
      });
    } else {
      this.props.pageLoadingSet(true);
      API.delete(`Expense?expenseId=${id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          this.setState(
            {
              rows: [],
            },
            () => {
              this.getData();
            }
          );
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          this.props.pageLoadingSet(false);
        });
    }
  };

  timeout = "";
  search = (e) => {
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
            <div className="col-md-3">
              <a
                className="primary-button d-inline-flex cursor-pointer"
                onClick={() => {
                  this.addRow();
                }}
              >
                Yeni Gider Ekle
              </a>
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-4">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={(startDate) => {
                      this.setState(
                        {
                          startDate: _.isNull(startDate) ? "" : startDate,
                        },
                        () => {
                          this.getData();
                        }
                      );
                    }}
                    placeholderText="Başlangıç Tarihi"
                    className="w-100"
                  />
                </div>
                <div className="col-md-4">
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={(endDate) => {
                      this.setState(
                        {
                          endDate: _.isNull(endDate) ? "" : endDate,
                        },
                        () => {
                          this.getData();
                        }
                      );
                    }}
                    placeholderText="Bitiş Tarihi"
                    className="w-100"
                  />
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                  <InputWLabel
                    name="search"
                    type="searchT"
                    classes="mb-0 w-100"
                    id="search"
                    value={this.state.search}
                    setValue={this.search}
                    tabIndex={1}
                    label=""
                    placeholder="Ara"
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
          </div>
        </div>
        <div>
          <InfiniteScroll
            dataLength={this.state.rows.length}
            next={() => this.getData("add")}
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
                    <th className="react-infinite-table-col-0">Tarih</th>
                    <th className="react-infinite-table-col-1">Gider İsmi</th>
                    <th className="react-infinite-table-col-2">Tutar</th>
                    <th className="react-infinite-table-col-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((i, index) => (
                    <tr key={index + "a"} id={"rowElement" + i.id}>
                      <td className="react-infinite-table-col-0 pt-3 pb-3">
                        <DatePicker
                          selected={new Date(i.createDate)}
                          onChange={(date) => {
                            this.handleChange(date, index);
                          }}
                          placeholderText="Başlangıç Tarihi"
                          className="w-100 min"
                          showTimeSelect
                          locale="tr"
                          dateFormat="d MMMM yyyy h:mm"
                          disabled={i.disabled}
                        />
                      </td>
                      <td className="react-infinite-table-col-1 pt-2 pb-2">
                        <InputWLabel
                          name={`gider${index}`}
                          type="text"
                          classes={`mb-0 mw-300 w-100 min ${
                            i.disabled ? "disabled" : ""
                          }`}
                          value={i.description}
                          tabIndex={1}
                          label=""
                          disabled={i.disabled}
                          setValue={(e) => this.handleChange(e, index)}
                        />
                      </td>
                      <td className="react-infinite-table-col-1 pt-2 pb-2">
                        <InputWLabel
                          name={`tutar${index}`}
                          type="text"
                          classes={`mb-0 mw-300 w-100 min ${
                            i.disabled ? "disabled" : ""
                          }`}
                          value={
                            i.disabled
                              ? formatMoney(i.amount) +
                                " " +
                                currency(i.currency)
                              : i.amount
                          }
                          tabIndex={1}
                          label=""
                          disabled={i.disabled}
                          setValue={(e) => this.handleChange(e, index)}
                        />
                      </td>
                      <td className="react-infinite-table-col-4 text-right pt-2 pb-2">
                        {i.disabled ? (
                          <a
                            className="d-inline-flex align-items-center text-blue pl-3 pr-3 cursor-pointer"
                            onClick={(e) => {
                              this.editRow(i, index);
                            }}
                          >
                            Düzenle
                          </a>
                        ) : (
                          <a
                            className="d-inline-flex align-items-center text-blue pl-3 pr-3 cursor-pointer"
                            onClick={(e) => {
                              this.editRowSave(i, index);
                            }}
                          >
                            Kaydet
                          </a>
                        )}
                        <a
                          className="d-inline-flex align-items-center text-pink pl-3 pr-3 cursor-pointer"
                          onClick={(e) => {
                            this.delete(index);
                          }}
                        >
                          Sil
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfiniteScroll>
        </div>
        <p className="mt-3 text-right">
          <b>Toplam Gider: {this.state.totalExpense}</b>
        </p>
      </div>
    );
  }
}

export default Expense;
