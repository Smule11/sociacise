import React from 'react';
import PropTypes from 'prop-types';
import '../App.css'; // Assuming you'll have a separate CSS file for styling

const Button = ({ onClick, label, type, className }) => {
    return (
        <button
            className={`custom-button ${className}`}
            onClick={onClick}
            type={type}
        >
            {label}
        </button>
    );
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string
}

Button.defaultProps = {
    type: 'button',
    className: ''
}

export default Button;