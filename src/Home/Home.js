import React, { Component } from "react";
import { connect } from "react-redux";
import { Bar } from '@reactchartjs/react-chart.js'
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { scrollToTop } from "../utils/helper";
import API, { headers } from "../utils/API";
import { alert, headerTitleSet } from "../App/appActions";


export class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      startDate: '',
      endDate:'',
      balanceList:[],
      creditTotal:null,
      debtTotal: null,
      list: [],
      data: {
        labels: [],
        datasets: [{
          type: 'line',
          label: ' ',
          borderColor: '#FDC132',
          borderWidth: 2,
          fill: false,
          data: [],
        },
        {
          type: 'bar',
          label: ' ',
          backgroundColor: '#38C976',
          data: [],
          borderColor: 'white',
          borderWidth: 0,
        }],
      },
    }
  }
  componentDidMount = () => {
    this.props.headerTitleSet(this.props.translate('home'));

    API.get("Dashboard/Home", { headers: { ...headers, Authorization: `Bearer ${this.props.user.token}`} })
        .then((res) => {
          const {balanceList, creditTotal, debtTotal, list} = res.data;
            const labels= [];
            const lineData= []
            const barData= []

          list.forEach((e, i) => {
            labels.push(i);
            lineData.push(e.amount)
            barData.push(e.amount)
          });
          console.log(labels, lineData, barData)
          console.log(22);
          this.setState({
            balanceList, 
            creditTotal, 
            debtTotal, 
            list,
            data: {
              labels,
              datasets: [{
                type: 'line',
                label: ' ',
                borderColor: '#FDC132',
                borderWidth: 2,
                fill: false,
                data: lineData,
              },
              {
                type: 'bar',
                label: ' ',
                backgroundColor: '#38C976',
                data: barData,
                borderColor: 'white',
                borderWidth: 0,
              }],
            }
          });
        })
        .catch((err) => {
        });
    scrollToTop();
  };
  setDate(date, type){
    if(type === 'start'){
      this.setState({
        startDate: date
      })
    } else{
      this.setState({
        endDate: date
      })
    }
  }
  render() {
    return (
      <div className="Home">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <Link className="primary-button d-inline-flex">
                Hasta Kaydı Oluştur
              </Link>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={(date) => this.setDate(date, "start")}
                    placeholderText="Başlangıç Tarihi"
                    className="w-100"
                  />
                </div>
                <div className="col-6">
                  <DatePicker
                    selected={this.state.endDate}
                    className="w-100"
                    onChange={(date) => this.setDate(date, "end")}
                    placeholderText="Bitiş Tarihi"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="border p-3 rounded h-100">
              <h3>Ciro</h3>
              <Bar data={this.state.data} />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="row h-100">
              <div className="col-12 mb-4">
                <div className="border rounded pl-3 pr-3 pt-4 pb-4 h-100">
                  <h3 className="border-bottom pb-3 mb-0">14.01.2021</h3>
                  <div className="row h-100 align-items-center">
                    <div className="col-6 text-center">
                      <p className="fs-24 mb-2">{this.state.list.length}</p>
                      <p className="mb-0">Tedavi Sayısı</p>
                    </div>
                    <div className="col-6 text-center">
                      <p className="fs-24 mb-2">{this.state.debtTotal} TL</p>
                      <p className="mb-0">Ciro</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex flex-column justify-content-end">
                <div className="border rounded pl-3 pr-3 pt-4 pb-4 h-100">
                  <h3 className="border-bottom pb-3 mb-0">Açık Bakiye</h3>
                  <div className="row h-100 align-items-center">
                    <div className="col-12 text-center">
                      <p className="fs-24 mb-2">{this.state.creditTotal} TL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    headerTitleSet: (text) => dispatch(headerTitleSet(text)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
