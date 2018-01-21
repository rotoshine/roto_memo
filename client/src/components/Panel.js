import './Panel.css';
import React from 'react';

const Panel = ({ className = '', style = {}, children }) => (
  <div className={`Panel ${className}`} style={style}>
    {children}
  </div>
);

export default Panel;