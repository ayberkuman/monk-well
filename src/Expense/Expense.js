import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from 'lodash'
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import tr from 'date-fns/locale/tr';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import API, { headers } from "../utils/API";
import { scrollToTop, currency, formatMoney } from "../utils/helper";
import InputWLabel from "../utils/components/InputWLabel";
import { authRoutes } from "../App/routes"
import InfiniteScroll from "react-infinite-scroll-component";
registerLocale('tr', tr)

export class Expense extends Component {
  constructor(props){
    super(props)
    this.state={
      rows: [],
      hasMore: false, 
      length: 10,
      currentpage: 1,
      search: ''
    }
  }

  
  componentDidMount = () => {
    scrollToTop();
    this.props.headerTitleSet(this.props.translate('expenses'));
    this.getData()
  };

  getData = ()=>{
    API.get(`Expense/List?searchBy=${this.state.search}&page=${this.state.currentpage}`, {
      headers: { ...headers, Authorization: `Bearer ${this.props.user.token}`, page: this.state.currentpage},
    })
      .then((res) => {
        this.props.pageLoadingSet(false);
        const { data } = res;
        const rows = this.state.rows;
        data.data.map(e => {
          rows.push({
            amount: e.amount,
            clinicId: e.clinicId,
            createDate: e.createDate,
            currency: e.currency,
            description: e.description,
            id: e.id,
            disabled: true,
          });
          rows.push({
            amount: e.amount,
            clinicId: e.clinicId,
            createDate: e.createDate,
            currency: e.currency,
            description: e.description,
            id: e.id,
            disabled: true,
          });
        });
        this.setState({
          currentpage: this.state.currentpage+1,
          rows: rows,
          hasMore: data.totalPages >= this.state.currentpage+1
        })
      })
      .catch((err) => {
        this.props.pageLoadingSet(false);
      });
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({search: value }, () => {
      setTimeout(this.handleCheck, 20);
    });
  };
  editRow = (x, i)=>{
    console.log('rowElement'+x.id);
    const arr = this.state.rows;
    arr[i].disabled = false;
    this.setState({
      rows: arr,
    })
  }
  editRowSave = (x, i)=>{
    for (let index = 0; index < document.getElementById('rowElement'+x.id).children.length; index++) {
      const element = document.getElementById('rowElement'+x.id).children[index].getElementsByTagName('INPUT')[0];
      if (element) {
        const item = {
          amount: x.amount,
          clinicId: this.state.rows[i].clinicId,
          createDate: x.createDate,
          currency: this.state.rows[i].currency,
          description: x.description,
          id: this.state.rows[i].id,
          disabled: true,
        };
        console.log(this.state.rows[i])
        console.log(item)
      }
    }
  }
  render() {
    return (
      <div className="Payments">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <Link className="primary-button d-inline-flex">
                Yeni Gider Ekle
              </Link>
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
                        {console.log(Date(i.createDate))}
                        <DatePicker
                          selected={new Date(i.createDate)}
                          onChange={(date) => {
                            console.log(date);
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
                          name=""
                          type="text"
                          classes="mb-0 mw-300 w-100 min disableded"
                          value={i.description}
                          tabIndex={1}
                          label=""
                          disabled={i.disabled}
                        />
                      </td>
                      <td className="react-infinite-table-col-1 pt-2 pb-2">
                        <InputWLabel
                          name=""
                          type="text"
                          classes="mb-0 mw-300 w-100 min disableded"
                          value={
                            formatMoney(i.amount) + " " + currency(i.currency)
                          }
                          tabIndex={1}
                          label=""
                          disabled={i.disabled}
                        />
                      </td>
                      <td className="react-infinite-table-col-4 text-right pt-2 pb-2">
                          {i.disabled? (<a
                            className="d-inline-flex align-items-center text-blue pl-3 pr-3 cursor-pointer"
                            onClick={(e) => {
                              this.editRow(i, index);
                            }}
                          >
                            Düzenle
                          </a>) : (<a
                            className="d-inline-flex align-items-center text-blue pl-3 pr-3 cursor-pointer"
                            onClick={(e) => {
                              this.editRowSave(i, index);
                            }}
                          >
                            Kaydet
                          </a>)}
                        
                        <Link
                          className="d-inline-flex align-items-center text-pink pl-3 pr-3"
                          to={authRoutes.addTreatment.links[this.props.lang].replace(
                            ":id",
                            i.id
                          )}
                        >
                          Sil
                        </Link>
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

export default Expense
