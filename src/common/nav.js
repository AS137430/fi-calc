import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './nav.css';

const navItems = [
  {
    key: 'calculator',
    label: 'Calculator',
    icon: 'mdi-calculator',
  },
  {
    key: 'about',
    label: 'About',
    icon: 'mdi-information',
  },
];

export default class Nav extends Component {
  render() {
    return (
      <nav className="nav">
        <ul className="nav-navList">
          {navItems.map(navItem => {
            return (
              <li className="nav-navListItem" key={navItem.key}>
                <NavLink
                  to={`/${navItem.key}`}
                  className="nav-navListLink"
                  activeClassName="nav-navListLink_active">
                  <i className={`mdi ${navItem.icon} nav-navListLinkIcon`} />
                  {navItem.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
