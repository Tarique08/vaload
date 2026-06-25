import React from 'react';
import './BracketCard.css';

/**
 * Card matching the user's Vaload mockup design.
 * Features square neon corner brackets and no heavy borders.
 */
const BracketCard = ({ children, color = 'cyan', className = '' }) => {
  return (
    <div className={`bracket-card-wrapper color-${color} ${className}`}>
      {/* Corner Brackets */}
      <div className="bracket-tl"></div>
      <div className="bracket-br"></div>
      
      {/* Content Container */}
      <div className="bracket-card-inner">
        {children}
      </div>
    </div>
  );
};

export default BracketCard;
