import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError = (error) => {
    return { hasError: true };
  };

  componentDidCatch = (error, errorInfo) => console.log(error, errorInfo);

  render() {
    if (this.state.hasError) return <h4>Oops... Something went wrong.</h4>;
    return this.props.children;
  }
}
