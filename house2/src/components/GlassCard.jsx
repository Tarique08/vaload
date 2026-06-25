import React from 'react';
import './GlassCard.css';

/**
 * A reusable glassmorphism card component with optional neon glow.
 * @param {string} glowColor - 'red', 'cyan', 'yellow', 'green', 'pink' or null
 */
const GlassCard = ({ children, className = '', glowColor = null, style = {} }) => {
  const glowClass = glowColor ? `glow-${glowColor}` : '';
  
  return (
    <div className={`glass-panel vaload-card ${glowClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default GlassCard;
