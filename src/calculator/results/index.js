import React, { Component } from 'react';

export default class Results extends Component {
  render() {
    const { successRate } = this.props;

    return (
      <div className="calculator_resultsText">
        <div>This portfolio succeeded</div>
        <div className="calculator_resultsPercentage">{successRate}</div>
        <div>of the time.</div>
      </div>
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
