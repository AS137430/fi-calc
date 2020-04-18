import React from 'react';
import { Link, Route } from 'react-router-dom';
import './nav.css';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav_logo">
        <Link to="/" className="nav_logoLink">
          FI
        </Link>
      </div>
      <div className="nav_cta">
        <Route path="/learn">
          <Link className="button button-micro" to="/calculator">
            Launch Calculator
          </Link>
        </Route>
        <Route path="/calculator">
          <Link className="button button-secondary button-micro" to="/learn">
            Learn About This Calculator
          </Link>
        </Route>
      </div>
    </nav>
  );
}
