import './Loading.css';
import React from 'react';

const Loading = ({ isVisible, size = "normal", style = {} }) => (
  <div className={`Loading ${size}`} style={style}>
    <img src={`${process.env.PUBLIC_URL}/loading.svg`} alt="loading progress" />
  </div>
);

export default Loading;