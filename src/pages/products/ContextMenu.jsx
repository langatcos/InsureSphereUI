import React from 'react';

const ContextMenu = ({ visible, x, y, onCopy, onClose }) => {
  return (
    visible && (
      <div
        className="context-menu"
        style={{ top: y, left: x, position: 'absolute', zIndex: 1000 }}
        onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
      >
        <div className="context-menu-option" onClick={onCopy}>Copy</div>
        <div className="context-menu-option" onClick={onClose}>Cancel</div>
      </div>
    )
  );
};

export default ContextMenu;
