import React from 'react';
import classnames from 'classnames';
import './footer.css';
import useIsCalculator from '../hooks/use-is-calculator';

export default function Footer() {
  const isCalculator = useIsCalculator();

  return (
    <footer className="footer">
      <div
        className={classnames('app_content', {
          'app_content-800px': isCalculator,
        })}>
        © 2020 FI Calc
      </div>
    </footer>
  );
}
