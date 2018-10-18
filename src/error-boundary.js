import React, { Component } from 'react';
import './error-boundary.css';

export default class ErrorBoundary extends Component {
  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1 className="errorBoundary_header">Something went wrong.</h1>
          <div className="errorBoundary_text">
            The application experienced an unexpected crash. We are deeply
            embarrassed, but we must recommend that you reload the application.
          </div>
        </>
      );
    }

    return this.props.children;
  }

  state = {
    hasError: false,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }
}
