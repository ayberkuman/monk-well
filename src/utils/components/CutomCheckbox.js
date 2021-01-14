import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CutomCheckbox extends Component {


  componentDidMount = () => {
    if (this.props.value) this.handleFocus();
  };

  componentDidUpdate = (prevProps) => {
    if (!prevProps.value && this.props.value && !this.state.isFilled)
      this.handleFocus();
  };

  render() {
    return (
      <div className="custom-control custom-checkbox mb-3">
        <input type="checkbox" className="custom-control-input" id="customCheck" name="example1" />
        <label className="custom-control-label" htmlFor="customCheck">{this.props.labelText}</label>
      </div>
    );
  }
}
CutomCheckbox.defaultProps = {
  labelText: ''
};
CutomCheckbox.propTypes = {
  labelText: PropTypes.string,
};
