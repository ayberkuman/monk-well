import React, { Component } from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
import { validateInput } from "../helper";

export default class TextareaWLabel extends Component {
  state = {
    isFilled: false,
    isActive: false,
  };

  id = crypto.randomBytes(6).toString("hex");

  componentDidMount = () => {
    if (this.props.value) this.handleFocus();
  };

  componentDidUpdate = (prevProps) => {
    if (!prevProps.value && this.props.value && !this.state.isFilled)
      this.handleFocus();
  };

  handleFocus = () => {
    document.getElementById(`input-${this.id}`).classList.add("focused");
    this.setState({ isActive: true, isFilled: true });
  };

  handleBlur = (e) => {
    this.setState({ isActive: false });

    if (this.props.validate)
      if (!validateInput(this.props.type, e.target.value)) {
        e.target.value = "";
        this.props.setValue(e);
      }

    if (e.target.value === "") {
      document.getElementById(`input-${this.id}`).classList.remove("focused");
      this.setState({ isFilled: false });
    }
  };

  render() {
    return (
      <div
        className={`InputWLabel position-relative d-flex justify-content-start align-items-center ${
          this.props.classes ? this.props.classes : ``
        }`}
        id={`input-${this.id}`}
        data-move-label={this.state.isFilled || this.state.isActive}
      >
        <textarea
          name={this.props.name}
          id={this.props.id}
          onChange={this.props.setValue}
          className="position-relative"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <label htmlFor={this.props.id} className="position-absolute">
          {this.props.label}
        </label>
      </div>
    );
  }
}

TextareaWLabel.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  classes: PropTypes.string,
  icon: PropTypes.object,
  validate: PropTypes.bool,
};
