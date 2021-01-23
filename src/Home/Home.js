import React, { Component } from "react";
import { connect } from "react-redux";
import { Bar } from '@reactchartjs/react-chart.js'
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { scrollToTop } from "../utils/helper";
import API, { headers } from "../utils/API";
import { headerTitleSet } from "../App/appActions";
import { authRoutes } from "../App/routes"

export class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      startDate: '',
      endDate:'',
      graphStartDate:moment().subtract(1, 'months').format('YYYY-MM-DD'),
      balanceList:[],
      creditTotal:null,
      debtTotal: null,
      processCount: 0,
      list: [],
      barFilter: 'mounth',
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
    this.getData()
    scrollToTop();
  };

  getData = () => {
    const startDate = this.state.startDate !== '' ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
    const endDate = this.state.endDate !== '' ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
    const graphStartDate = this.state.graphStartDate !== '' ? moment(this.state.graphStartDate).format('YYYY-MM-DD') : ''
    API.get(`Dashboard/Home?startDate=${startDate}&endDate=${endDate}&graphStartDate=${graphStartDate}`, { headers: { ...headers, Authorization: `Bearer ${this.props.user.token}` }})
        .then((res) => {
          const {balanceList, creditTotal, debtTotal, list, processCount} = res.data;
            const labels= [];
            const lineData= []
            const barData= []
          balanceList.forEach((e, i) => {
            labels.push(moment(e.date).format('DD.MM.YY'));
            lineData.push(e.amount)
            barData.push(e.amount)
          });
          this.setState({
            balanceList, 
            creditTotal, 
            debtTotal, 
            list,
            processCount,
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
          this.props.pageLoadingSet(false);
        })
        .catch((err) => {
          alert(err.response.data.value)
          this.props.pageLoadingSet(false);
        });
  }

  setDate(date, type){
    if(type === 'start'){
      this.setState({
        startDate: date
      }, ()=>{
        this.state.endDate !== '' && this.state.startDate !== '' && this.getData()
      })
    } else{
      this.setState({
        endDate: date
      },()=>{
        this.state.endDate !== '' && this.state.startDate !== '' && this.getData()
      })
    }
  }
  barFilter(e){
    let date = '';
    if (e === 'day') {
      date = moment().subtract(7, 'day').format('YYYY-MM-DD')
    } else if(e === 'mounth'){
      date = moment().subtract(1, 'months').format('YYYY-MM-DD')
    } else if(e==='year'){
      date = moment().subtract(1, 'years').format('YYYY-MM-DD')
    }
    console.log(date);
    this.setState({
      barFilter: e,
      graphStartDate: date
    },()=>{
      this.getData()
    })
  }

  render() {
    return (
      <div className="Home">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <Link
                className="primary-button d-inline-flex"
                to={authRoutes.patientRegistry.links[this.props.lang]}
              >
                Hasta Kaydı Oluştur
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="border p-3 rounded h-100">
              <div className="d-flex justify-content-between align-items-center">
                <h3>Ciro</h3>
                <div className="bar-filter">
                  <a
                    className={this.state.barFilter === 'day' ? 'active' : ''}
                    alt="D"
                    onClick={() => {
                      this.barFilter('day')
                    }}
                  >
                    D
                  </a>
                  <a
                    className={this.state.barFilter === 'mounth' ? 'active' : ''}
                    alt="M"
                    onClick={() => {
                      this.barFilter('mounth')
                    }}
                  >
                    M
                  </a>
                  <a
                    className={this.state.barFilter === 'year' ? 'active' : ''}
                    alt="Y"
                    onClick={() => {
                      this.barFilter('year')
                    }}
                  >
                    Y
                  </a>
                </div>
              </div>
              <Bar data={this.state.data} />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="row h-100">
              <div className="col-12 mb-4">
                <div className="border rounded pl-3 pr-3 pt-4 pb-4">
                  <div className="pb-3 mb-4 border-bottom">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-6">
                          <DatePicker
                            selected={this.state.startDate}
                            onChange={(date) => this.setDate(date, "start")}
                            placeholderText="Başlangıç Tarihi"
                            className="w-100 min"
                          />
                        </div>
                        <div className="col-6">
                          <DatePicker
                            selected={this.state.endDate}
                            className="w-100 min"
                            onChange={(date) => this.setDate(date, "end")}
                            placeholderText="Bitiş Tarihi"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row h-100 align-items-center">
                    <div className="col-6 text-center">
                      <p className="fs-24 mb-2">{this.state.processCount}</p>
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
                      <p className="fs-24 mb-2">
                        {this.state.debtTotal - this.state.creditTotal} TL
                      </p>
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
