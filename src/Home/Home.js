import React, { Component } from "react";
import { connect } from "react-redux";
import { Bar } from '@reactchartjs/react-chart.js'
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { scrollToTop } from "../utils/helper";
import { headerTitleSet } from "../App/appActions";
const rand = () => Math.round(Math.random() * 20)

const data = {
  labels: ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'],
  datasets: [
    {
      type: 'line',
      label: ' ',
      borderColor: '#FDC132',
      borderWidth: 2,
      fill: false,
      data: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(),rand(), rand(), rand(), rand(), rand(), rand(), rand()],
    },
    {
      width: 1,
      type: 'bar',
      label: ' ',
      backgroundColor: '#38C976',
      data: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(),rand(), rand(), rand(), rand(), rand(), rand(), rand()],
      borderColor: 'white',
      borderWidth: 0,
    }
  ],
}

export class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      startDate: '',
      endDate:''
    }
  }
  componentDidMount = () => {
    this.props.headerTitleSet(this.props.translate('home'));
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
        <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
          <div className="row w-100">
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
              <Bar data={data} />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="row h-100">
              <div className="col-12 mb-4">
                <div className="border rounded pl-3 pr-3 pt-4 pb-4 h-100">
                  <h3 className="border-bottom pb-3 mb-0">14.01.2021</h3>
                  <div className="row h-100 align-items-center">
                    <div className="col-6 text-center">
                      <p className="fs-24 mb-2">1.2460</p>
                      <p className="mb-0">Tedavi Sayısı</p>
                    </div>
                    <div className="col-6 text-center">
                      <p className="fs-24 mb-2">35.600 TL</p>
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
                      <p className="fs-24 mb-2">14.600 TL</p>
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


const mapDispatchToProps = (dispatch) => {
  return {
    headerTitleSet: (text) => dispatch(headerTitleSet(text)),
  };
};

export default connect(null, mapDispatchToProps)(Home);
