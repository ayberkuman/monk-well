import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {Table} from 'react-infinite-table';
import { headerTitleSet } from "../App/appActions";
import { scrollToTop } from "../utils/helper";
import InputWLabel from "../utils/components/InputWLabel";

export class UserPayments extends Component {
  componentDidMount = () => {
    scrollToTop();
    console.log(this.props);
  };

  render() {
    return (
      <div className="Payments">
        asdasd
      </div>
    );
  }
}

export default UserPayments
