import React, { Component } from "react";
import PropTypes from "prop-types";
import { toggleModal } from "../../App/appActions";
import { connect } from "react-redux";

class Modal extends Component {
  componentDidMount = () => this.props.toggleModal(true);
  componentWillUnmount = () => this.props.toggleModal(false);
  render() {
    return (
      <div
        className={`Modal d-flex justify-content-center align-items-center position-fixed vw-100 vh-100 ${this.props.className}`}
        ref={this.props.modalRef}
      >
        <div
          className="overlay vw-100 vh-100 position-fixed"
          onClick={this.props.closeModal}
        ></div>
        <div className="inner position-relative d-flex flex-column">
          <div className="header d-flex justify-content-between align-items-center">
            <h6 className="title">{this.props.title}</h6>
            <button
              className="close-button d-flex justify-content-center align-items-center"
              onClick={this.props.closeModal}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7"
                  stroke="#474555"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 1L7 7"
                  stroke="#474555"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            className={`content h-100 ${
              !(`noOverflow` in this.props) ? `overflow-auto` : ``
            }`}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  closeModal: () => {},
  className: "",
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  modalRef: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  toggleModal: (status) => dispatch(toggleModal(status)),
});

export default connect(null, mapDispatchToProps)(Modal);
