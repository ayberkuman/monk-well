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
    // this.props.pageLoadingSet(true);
    API.get(`Expense/List?searchBy=${this.state.search}&page=${this.state.currentpage}`, {
      headers: { ...headers, Authorization: `Bearer ${this.props.user.token}`, page: this.state.currentpage},
    })
      .then((res) => {
        // this.props.pageLoadingSet(false);
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
            type: ''
          });
        });
        this.setState({
          currentpage: this.state.currentpage+1,
          rows: rows,
          hasMore: data.totalPages >= this.state.currentpage+1
        })
      })
      .catch((err) => {
        // this.props.pageLoadingSet(false);
      });
  }
  handleChange = (e, index) => {
    const arr = this.state.rows;
    if (!_.isUndefined(e.target)) {
      if (e.target.name.includes('gider')) {
        arr[index].description = e.target.value
      } else if (e.target.name.includes('tutar')) {
        arr[index].amount = e.target.value
      }  
    } else{
      arr[index].createDate = e
    }
    
    this.setState({
      rows: arr
    })
    
  };
  addRow = () =>{
    const arr = this.state.rows;
    arr.unshift({
      amount: "",
      createDate: new Date(),
      description: "",
      disabled: false,
      type: 'new',
    });
    this.setState({
      rows: arr
    })
    console.log(this.state.rows);
  }
  editRow = (x, i)=>{
    const arr = this.state.rows;
    arr[i].disabled = false;
    this.setState({
      rows: arr,
    })
  }
  editRowSave = (x, i)=>{
    const data = {
      "id": this.state.rows[i].id,
      "clinicId": this.state.rows[i].clinicId,
      "description": this.state.rows[i].description,
      "createDate": moment(this.state.rows[i].createDate).format(),
      "amount": parseFloat(this.state.rows[i].amount),
      "currency": this.state.rows[i].currency,
    };
    this.props.pageLoadingSet(true);
    this.setState({
      rows: []
    }, ()=>{
    API.post("Expense", data, { headers: { ...headers,Authorization: `Bearer ${this.props.user.token}`, } })
      .then((res) => {
        this.props.pageLoadingSet(false);
        const oldData = this.state.rows;
        oldData.splice(i, 1);
        this.setState({
          rows: oldData,
        });
        this.getData()
      })
      .catch((err) => {
        this.props.pageLoadingSet(false);
        this.setState({ isSending: false });
      });
    })
  }

  delete = (i) => {
    console.log(this.state.rows);
    const id = this.state.rows[i].id
    const arr = this.state.rows;
    if (this.state.rows[i].type === 'new') {
      arr.splice(i, 1);
      this.setState({
        rows: arr
      })
    }
    else{
    this.props.pageLoadingSet(true);
    API.delete(`Expense?expenseId=${id}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    })
      .then((res) => {
        this.setState({
          rows: [],
        },()=>{
          this.getData();
        })
        this.props.pageLoadingSet(false);
      })
      .catch((err) => {
        this.props.pageLoadingSet(false);
      });
    }
  }
  render() {
    return (
      <div className="Payments">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <a className="primary-button d-inline-flex" onClick={()=>{this.addRow()}}>
                Yeni Gider Ekle
              </a>
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
                        <DatePicker
                          selected={new Date(i.createDate)}
                          onChange={(date) => {
                            this.handleChange(date, index)
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
                          setValue={(e)=>this.handleChange(e, index)}
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
                            i.disabled?formatMoney(i.amount) + " " + currency(i.currency) : i.amount
                          }
                          tabIndex={1}
                          label=""
                          disabled={i.disabled}
                          setValue={(e)=>this.handleChange(e, index)}
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
      </div>
    );
  }
}

export default Expense
