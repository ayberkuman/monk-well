import React, { Component } from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
import { validateInput } from "../helper";

export default class InputWLabel extends Component {
  state = {
    isFilled: false,
    isActive: false,
    passwordShow: false,
    type: this.props.type,
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
    // document.getElementById(`input-${this.id}`).classList.add("focused");
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
      // document.getElementById(`input-${this.id}`).classList.remove("focused");
      this.setState({ isFilled: false });
    }
  };

  render() {
    return (
      <div
        className={`InputWLabel position-relative d-flex justify-content-start align-items-center focused mt-3 ${
          this.props.classes ? this.props.classes : ``
        }`}
        id={`input-${this.id}`}
        data-move-label={this.state.isFilled || this.state.isActive}
        data-w-icon={"icon" in this.props}
        data-error={Boolean(this.props.errorMessage)}
        data-error-message={`* ${this.props.errorMessage}`}
        data-is-editable={this.props.editable}
        data-is-content-hidden={!this.state.isFilled && !this.state.isActive}
        onClick={
          this.props.editable && this.props.editFunc
            ? this.props.editFunc
            : () => {}
        }
      >
        {this.props.icon ? (
          <div className="icon d-flex justify-content-center align-items-center">
            {this.props.icon}
          </div>
        ) : (
          ""
        )}
        <input
          type={this.state.type}
          name={this.props.name}
          id={this.props.id}
          value={this.props.value}
          ref={this.props.inputRef}
          className="position-relative"
          onChange={this.props.setValue}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          tabIndex={this.props.tabIndex}
          readOnly={this.props.readOnly || this.props.editable ? true : false}
          autoComplete="off"
          placeholder={this.props.placeholder}
          maxLength={this.props.maxLength}
          inputMode={
            this.props.type === "tel"
              ? "tel"
              : this.props.type === "email"
              ? "email"
              : "text"
          }
        />
        {this.props.type === "password" && this.props.value !== "" && (
          <button
            className="btn link"
            onClick={() => {
              this.setState({
                type: this.state.type === "password" ? "text" : this.props.type,
              });
            }}
          >
            {this.state.type === "password" ? "Göster" : "Gizle"}
          </button>
        )}
        {this.props.type === "searchT" && (
          <button
            className="btn link"
            onClick={() => {
              this.props.searchHandle();
            }}
          >
            Ara
          </button>
        )}
        {this.props.type === "discount" && (<div className='discount'>%</div>)

        }
        <label htmlFor={this.props.id} className="position-absolute">
          {this.props.label}
        </label>
      </div>
    );
  }
}

InputWLabel.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  inputRef: PropTypes.object,
  classes: PropTypes.string,
  icon: PropTypes.object,
  validate: PropTypes.bool,
  placeholder: PropTypes.string,
};
