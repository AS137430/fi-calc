import React, { useState } from 'react';
import IconKeyboardArrowRight from 'materialish/icon-keyboard-arrow-right';
import IconHelp from 'materialish/icon-help';
import './sidebar-section.css';
import Expandable from '../common/expandable';

export default function ConfigSection({
  title,
  children,
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
      <ConfigSection.Header onClick={() => setOpen(v => !v)}>
        {title}
        {typeof onHelpClick === 'function' && (
          <div
            title={onHelpTitle}
            className="sidebarSection_helpIcon helpIcon"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onHelpClick();
            }}>
            <IconHelp />
          </div>
        )}
      </ConfigSection.Header>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open })
      )}
    </div>
  );
}

ConfigSection.Header = function({ children, ...props }) {
  return (
    <button className="sidebarSection_header" {...props}>
      <IconKeyboardArrowRight
        className="sidebarSection_headerIcon"
        size="1.2rem"
      />
      {children}
    </button>
  );
};

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
