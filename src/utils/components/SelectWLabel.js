import React, { Component } from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
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
        }`}
        id={`input-${this.id}`}
        data-move-label={this.state.isFilled || this.state.isActive}
        data-w-icon={"icon" in this.props}
        data-label={this.props.label}
      >
        {this.props.icon ? (
          <div className="icon d-flex justify-content-center align-items-center">
            {this.props.icon}
          </div>
        ) : (
          ""
        )}
        <select
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          value={
            this.props.value ? this.props.value : "empty-placeholder-value"
          }
          ref={this.props.ref}
          className="position-relative"
          onChange={this.props.setValue}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          <option value="empty-placeholder-value" hidden></option>
          {this.props.options
            ? this.props.options.map(({ value, name }, index) => (
                <option key={index} value={value}>
                  {name}
                </option>
              ))
            : ``}
        </select>
      </div>
    );
  }
}

SelectWLabel.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  ref: PropTypes.object,
  classes: PropTypes.string,
  icon: PropTypes.object,
  validate: PropTypes.bool,
};
