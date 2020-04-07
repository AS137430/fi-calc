import React from 'react';
import './sidebar-panel.css';

export default function SidebarPanel({ title, children }) {
  return (
    <div className="sidebarPanel">
      {typeof title === 'string' && (
        <div className="sidebarPanel_title">{title}</div>
      )}
      <div className="sidebarPanel_body">{children}</div>
    </div>
  );
}
