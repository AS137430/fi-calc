import React, { useState } from 'react';
import IconKeyboardArrowRight from 'materialish/icon-keyboard-arrow-right';
import IconHelp from 'materialish/icon-help';
import './sidebar-section.css';
import Expandable from '../common/expandable';

export default function ConfigSection({
  title,
  children,
  count,
  onHelpClick,
  initialIsOpen = false,
  onHelpTitle = 'Learn more',
}) {
  const [open, setOpen] = useState(initialIsOpen);

  return (
    <div
      className={`sidebarSection ${
        open ? 'sidebarSection-open' : 'sidebarSection-closed'
      }`}>
      <div className="sidebarSection_header">
        <button
          className="sidebarSection_expandBtn"
          onClick={() => setOpen(v => !v)}>
          <IconKeyboardArrowRight
            className="sidebarSection_headerIcon"
            size="1.2rem"
          />
          <span className="sidebarSection_headerText">{title}</span>
          {typeof count !== 'undefined' && (
            <span className="sidebarSection_titleCount">{count}</span>
          )}
        </button>
        {typeof onHelpClick === 'function' && (
          <button
            type="button"
            title={onHelpTitle}
            className="sidebarSection_helpIcon helpIcon"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onHelpClick();
            }}>
            <IconHelp />
          </button>
        )}
        <div className="sidebarSection_display" />
      </div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open })
      )}
    </div>
  );
}

ConfigSection.Contents = function({ children, open, className, ...props }) {
  return (
    <Expandable
      open={open}
      className={`sidebarSection_contents ${className}`}
      {...props}>
      <div className="sidebarSection_contentsWrapper">{children}</div>
    </Expandable>
  );
};
