import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {Table} from 'react-infinite-table';
import { headerTitleSet } from "../App/appActions";
import { scrollToTop } from "../utils/helper";
import InputWLabel from "../utils/components/InputWLabel";
import { authRoutes, globalRoutes } from "../App/routes"


const N_ROWS = 20
const INFINITE_SCROLLING_N_ROWS = 10
const N_COLS = 5
const headers = ['Hasta Adı', 'Fatura Tutarı', 'Tahsil Edilmiş', 'Açık Bakiye', '']



export class Payments extends Component {
  constructor(props){
    super(props)
    this.state={
      noRows: false,
      numberOfColumns: N_COLS,
      columns: this.createColumns(N_COLS),
      fixedColumnsCount: 0,
      fillTableWidth: true,
      displayBottomUpwards: false,
      infiniteScrolling: true,
      rows: this.createAllRows(),
      isInfiniteLoading: false,
      selectedRows: {},
      canSelectMultipleRows: false,
    }
  }


  cellRenderer = ({
    columnIndex,
    column,
    rowData,
    rowIndex,
    className
  }) => {
    if(N_COLS-1 === column.i){
      return (
        <td className={className} style={{textAlign: 'right'}}>
          <Link
           className="primary-button md d-inline-flex"
           to={globalRoutes.userPayments.links[this.props.lang].replace(":id", rowIndex)}
           >Ödeme Al</Link>
        </td>
      );
    }
    else{
      return (
        <td className={className}>
          R:{rowIndex} C:{rowIndex}
        </td>
      );
    }
  }
  
  headerRenderer = ({
    columnIndex,
    column,
    className
  }) => {
      return <th className={className}>{column.headers[column.i]}</th>;
  }
  
  createColumns = (numberOfColumns) => {
    const _columns = []
  
    for (let index = 0; index < numberOfColumns; index++) {
      _columns.push({
        i: _columns.length,
        cellRenderer: this.cellRenderer,
        headerRenderer: this.headerRenderer,
        width: 150,
        headers,
      });
    }
    return _columns
  }
  
  createAllRows = () => {
    const rows = []
    for (let index = 0; index < N_ROWS; index++) {
      rows.push({ id: rows.length })
    }
    return rows
  }

  componentDidMount = () => {
    scrollToTop();
    this.props.headerTitleSet(this.props.translate('payments'));
  };
  componentWillUnmount () {
    clearTimeout(this._loadRowsTimeout)
  }


  onNumberOfColumnsChange = numberOfColumns => {
    this.setState({
      numberOfColumns: numberOfColumns,
      columns: this.createColumns(numberOfColumns)
    })
  }

  onInfiniteLoad = () => {
    console.log('Loading new rows!')
    this.setState({
      isInfiniteLoading: true
    })
    this._loadRowsTimeout = setTimeout(() => {
      const displayBottomUpwards = this.state.displayBottomUpwards
      const rows = [...this.state.rows]
      if (displayBottomUpwards) {
        rows.reverse()
      }

      for (let index = 0; index < INFINITE_SCROLLING_N_ROWS; index++) {
        rows.push({ i: rows.length })
      }

      if (displayBottomUpwards) {
        rows.reverse()
      }

      this.setState({
        rows: rows,
        isInfiniteLoading: false
      })
    }, 2000)
  }

  onSelectionChange = selectedRows => {
    this.setState({
      selectedRows: selectedRows
    })
  }
  render() {
    const {
      fixedColumnsCount,
      fillTableWidth,
      infiniteScrolling,
      displayBottomUpwards,
      rows,
      columns,
      selectedRows,
      canSelectMultipleRows
    } = this.state
    return (
      <div className="Payments">
        <div className="align-items-center justify-content-between mt-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <Link className="primary-button d-inline-flex">
                Hasta Kaydı Oluştur
              </Link>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <InputWLabel
                name="email"
                type="email"
                classes="mb-0 mw-300 w-100"
                id="email"
                value={""}
                setValue={this.handleChange}
                validate={true}
                tabIndex={1}
                label=''
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
        <Table
        className='example-table'
        tableClassName='table table-bordered table-striped'
        height={600}
        rowHeight={50}
        rows={rows}
        columns={columns}
        fixedColumnsCount={fixedColumnsCount}
        headerCount={1}
        footerCount={0}
        fillTableWidth={fillTableWidth}
        noRowsRenderer={() => 'No rows'}
        rowIdKey='i'
        selectedRows={selectedRows}
        canSelectMultipleRows={canSelectMultipleRows}
        onSelectionChange={this.onSelectionChange}
        infiniteLoadBeginEdgeOffset={infiniteScrolling ? 150 : undefined}
        isInfiniteLoading={infiniteScrolling ? this.state.isInfiniteLoading : undefined}
        onInfiniteLoad={infiniteScrolling ? this.onInfiniteLoad : undefined}
        getLoadingSpinner={() => <div>Yükleniyor...</div>}
        displayBottomUpwards={displayBottomUpwards}
        onColumnOrderChange={false}
      />
        </div>
      </div>
    );
  }
}

export default Payments
