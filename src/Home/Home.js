import React, { Component } from "react";
import { scrollToTop } from "../utils/helper";

export class Home extends Component {
  componentDidMount = () => {
    console.log(this.props)
    scrollToTop();
  };

  render() {
    return (
      <div className="Home">
        {this.props.translate('home')}
      </div>
    );
  }
}

export default Home;
