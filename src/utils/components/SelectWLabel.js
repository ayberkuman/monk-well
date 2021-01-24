import React, { Component } from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { validateInput } from "../helper";

export default class SelectWLabel extends Component {
  state = {
    isFilled: false,
    isActive: false,
  };

  id = crypto.randomBytes(6).toString("hex");

  componentDidMount = () => {
    if (this.props.value) this.setState({ isFilled: true }, this.handleFocus);
  };

  componentDidUpdate = (prevProps) => {
    if (!prevProps.value && this.props.value && !this.state.isFilled)
      this.setState({ isFilled: true }, this.handleFocus);
  };

  handleFocus = () =>
    document.getElementById(`input-${this.id}`).classList.add("focused");

  handleBlur = (e) => {
    if (this.props.validate)
      if (!validateInput(this.props.type, e.target.value)) {
        e.target.value = "";
        this.props.setValue(e);
      }

    if (e.target.value === "" || e.target.value === "empty-placeholder-value")
      document.getElementById(`input-${this.id}`).classList.remove("focused");
  };

  render() {
    return (
      <div
        className={`SelectWLabel position-relative d-flex justify-content-start align-items-center ${
          this.props.classes ? this.props.classes : ``
        } ${this.props.errorMessage !=='' ? 'error':''}`}
        id={`input-${this.id}`}
        data-move-label={this.state.isFilled || this.state.isActive}
        data-w-icon={"icon" in this.props}
        data-label={this.props.label}
        data-error={Boolean(this.props.errorMessage)}
        data-error-message={`* ${this.props.errorMessage}`}
      >
        {this.props.icon ? (
          <div className="icon d-flex justify-content-center align-items-center">
            {this.props.icon}
          </div>
        ) : (
          ""
        )}
        <Typeahead
          id={this.props.id}
          onChange={this.props.setValue}
          options={this.props.options}
          placeholder={this.props.placeholder}
          selected={this.props.value}
          value={this.props.value}
        />
        <label className='position-absolute'>{this.props.label}</label>
      </div>
    );
  }
}
