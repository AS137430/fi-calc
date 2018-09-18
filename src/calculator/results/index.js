import React, { Component, Fragment } from 'react';
import './index.css';

export default class Results extends Component {
  render() {
    const { successRate } = this.props;

    return (
      <Fragment>
        <div className="calculator_resultsText">
          <div>This portfolio succeeded</div>
          <div className="calculator_resultsPercentage">{successRate}</div>
          <div>of the time.</div>
        </div>
      </Fragment>
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.unregisterKeys();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      this.registerKeys();
    }
  }

  componentWillUnmount() {
    this.unregisterKeys();
  }

  registerKeys = () => {
    window.addEventListener('keydown', this.onKeyDown);
  };

  unregisterKeys = () => {
    window.removeEventListener('keydown', this.onKeyDown);
  };

  onKeyDown = e => {
    const { onClose } = this.props;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();

      onClose();
    }
  };
}
