import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';

const Button = ({
  text,
  onClick,
  backgroundColor,
  hoverColor,
  textColor,
  border,
  fontBold,
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 rounded ${backgroundColor} ${textColor} ${border} ${className} 
        transition duration-300 ease-in-out transform hover:${hoverColor}`}
      onClick={onClick}
      {...props}
    >
      {Icon && (
        <IconContext.Provider value={{ size: '1.2em' }}>
          <Icon className="mr-2" />
        </IconContext.Provider>
      )}
      <span className={`${fontBold}`}>{text}</span>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
  textColor: PropTypes.string,
  border: PropTypes.string,
  fontBold: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export default Button;