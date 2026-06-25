import React from 'react';
import './HudCard.css';

/**
 * A complex Sci-Fi HUD card mimicking the provided dreamstime examples.
 * Uses CSS clip-path and nested elements to create chamfered borders.
 */
const HudCard = ({ children, color = 'cyan', className = '' }) => {
  return (
    <div className={`hud-card-wrapper color-${color} ${className}`}>
      {/* Outer container creates the border via background color */}
      <div className="hud-card-outer">
        {/* Inner container creates the background and leaves a 2px gap for the border */}
        <div className="hud-card-inner">
          
          {/* Decorative Elements */}
          <div className="hud-corner-tl"></div>
          <div className="hud-corner-br"></div>
          
          {/* Striped pattern overlay */}
          <div className="hud-stripes"></div>

          {/* Content */}
          <div className="hud-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HudCard;
