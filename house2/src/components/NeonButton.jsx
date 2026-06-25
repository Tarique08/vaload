import React from 'react';
import './NeonButton.css';

/**
 * A stylized button with neon effects.
 * @param {string} color - 'cyan', 'red', 'yellow' (default is cyan)
 */
const NeonButton = ({ children, onClick, color = 'cyan', type = 'button', className = '' }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`neon-btn neon-btn-${color} ${className}`}
    >
      <span className="neon-btn-text">{children}</span>
    </button>
  );
};

export default NeonButton;
