import React, { Component } from 'react';

export default class Privacy extends Component {
  render() {
    return (
      <div className="standardPage">
        <h1 className="primaryHeader">Privacy Policy</h1>
        <h2 className="secondaryHeader">Information We Collect</h2>
        <p className="appParagraph">
          FI Calc uses common technologies for all visitors, such as cookies, to
          track the same basic information that all websites collect.
        </p>
        <h2 className="secondaryHeader">
          How We Share the Information We Collect
        </h2>
        <p className="appParagraph">
          We do not share or sell any information we collect.
        </p>
      </div>
    );
  }
}
