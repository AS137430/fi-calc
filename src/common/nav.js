import React from 'react';
import classnames from 'classnames';
import { Link, Route } from 'react-router-dom';
import './nav.css';
import useIsCalculator from '../hooks/use-is-calculator';

export default function Nav() {
  const isCalculator = useIsCalculator();

  return (
    <nav
      className={classnames('nav', {
        'nav-calculator': isCalculator,
      })}>
      <div
        className={classnames('app_content', {
          'app_content-fullscreen': isCalculator,
        })}>
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
      </div>
    </nav>
  );
}
