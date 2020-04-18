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
            <img
              src="/logo-small.png"
              alt="FI Calc"
              className="nav_logoLinkImg"
            />
          </Link>
        </div>
        <div className="nav_cta">
          <Route path="/getting-started">
            <Link className="button button-micro" to="/calculator">
              Launch Calculator
            </Link>
          </Route>
          <Route path="/calculator">
            <Link
              className="button button-secondary button-micro"
              to="/getting-started">
              Learn About This Calculator
            </Link>
          </Route>
        </div>
      </div>
    </nav>
  );
}
