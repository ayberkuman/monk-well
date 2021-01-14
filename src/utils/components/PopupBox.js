import React, { Component } from "react";

export default class PopupBox extends Component {
  componentDidMount = () => {
    if (this.props.in) this.handleShowPopup();
  };

  componentDidUpdate = (prevProps) => {
    if (!prevProps.in && this.props.in) this.handleShowPopup();

    if (prevProps.in && !this.props.in) this.handleClosePopup();
  };

  componentWillUnmount = () => this.handleClosePopup();

  handleShowPopup = () => document.body.setAttribute("data-overlay-on", "true");

  handleClosePopup = () =>
    document.body.setAttribute("data-overlay-on", "false");

  render() {
    return (
        <div
          className={`${
            this.props.className ? this.props.className : `popup-box`
          } position-fixed d-flex justify-content-center align-items-center`}
        >
          <div className="inner d-flex flex-column justify-content-center align-items-center">
            {this.props.children}
          </div>
        </div>
    );
  }
}
