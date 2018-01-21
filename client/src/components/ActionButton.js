import './ActionButton.css';

import React from 'react';
import PropTypes from 'prop-types';

const ButtonStyle = {
  primary: 'primary',
  info: 'info',
  danger: 'danger'
};

const getButtonStyle = (props) => {
  for (let key in ButtonStyle) {
    const styleName = ButtonStyle[key];
    if (props.hasOwnProperty(styleName) && props[styleName]) {
      return styleName;
    }
  }

  return '';
};

const ActionButton = (props) => {
  const { style = {}, iconName, disabled, onClick } = props;
  return (
    <button className={`ActionButton ${getButtonStyle(props)}`} 
      style={style} 
      disabled={disabled}
      onClick={onClick}>
      <i className={`fa ${iconName}`} />
    </button>
  )
};


ActionButton.propTypes = {
  primary: PropTypes.bool,
  info: PropTypes.bool,
  danger: PropTypes.bool,
  style: PropTypes.object,
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ActionButton;