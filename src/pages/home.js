import React from 'react';
import { Link } from 'react-router-dom';
import IconArrowForward from 'materialish/icon-arrow-forward';
import './home.css';

export default function Home() {
  return (
    <div className="home">
      <h1 className="home_title">
        <img src="/fi-calc-logo.png" alt="FI Calc" className="home_titleImg" />
      </h1>
      <div className="home_description">
        FI Calc is a powerful and flexible retirement calculator. It simulates
        retirement plans using historical data, giving you the confidence you
        need to retire.
      </div>
      <div className="home_ctas">
        <Link
          to="/getting-started"
          className="home_cta button button-secondary home_learnMoreBtn">
          Learn More
        </Link>
        <Link to="/calculator" className="home_cta button home_launchCta">
          Launch Calculator
          <IconArrowForward />
        </Link>
      </div>
    </div>
  );
}
