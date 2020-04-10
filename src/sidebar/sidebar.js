import React from 'react';
import './sidebar.css';
import Mode from './mode';
import SpendingPlan from './spending-plan';
import Portfolio from './portfolio';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h1 className="sidebar_title">Configuration</h1>
      <Mode />
      <SpendingPlan />
      <Portfolio />
    </div>
  );
}
