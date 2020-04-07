import React from 'react';
import './sidebar.css';
import Mode from './mode';
import LengthOfRetirement from './length-of-retirement';
import SpendingPlan from './spending-plan';
import Portfolio from './portfolio';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Mode />
      <LengthOfRetirement />
      <SpendingPlan />
      <Portfolio />
    </div>
  );
}
