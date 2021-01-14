import React, { Component } from "react";


import { scrollToTop } from "../utils/helper";

export class Payments extends Component {
  componentDidMount = () => {
    scrollToTop();
  };

  render() {
    return (
      <div className="Payments">
        {this.props.translate('payments')}
      </div>
    );
  }
}

export default Payments;
