import React, { useEffect, useRef } from 'react';
import './SchematicBackground.css';

const SchematicBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      // Calculate mouse position relative to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      // Update CSS variables for tracking effect
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="schematic-container" ref={containerRef}>
      {/* Background Layer (Moves slowest) */}
      <div className="schematic-layer layer-1">
        <svg viewBox="0 0 1000 1000" className="blueprint-svg blueprint-faint">
          <circle cx="500" cy="500" r="400" fill="none" stroke="rgba(0, 255, 204, 0.15)" strokeWidth="2" strokeDasharray="10 20" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="rgba(255, 70, 85, 0.1)" strokeWidth="1" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        </svg>
      </div>

      {/* Middle Layer (Medium speed) */}
      <div className="schematic-layer layer-2">
        <svg viewBox="0 0 1000 1000" className="blueprint-svg blueprint-mid">
          <circle cx="200" cy="800" r="100" fill="none" stroke="rgba(0, 255, 204, 0.25)" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="200" cy="800" r="120" fill="none" stroke="rgba(0, 255, 204, 0.15)" strokeWidth="4" />
          <path d="M 150 800 L 250 800 M 200 750 L 200 850" stroke="rgba(0, 255, 204, 0.3)" strokeWidth="2" />
          
          <rect x="750" y="150" width="150" height="150" fill="none" stroke="rgba(255, 70, 85, 0.2)" strokeWidth="1" strokeDasharray="10 10" />
          <path d="M 720 150 L 930 150 M 750 120 L 750 330" stroke="rgba(255, 70, 85, 0.15)" strokeWidth="1" />
        </svg>
      </div>

      {/* Foreground Layer (Moves fastest, slightly blurred out of focus) */}
      <div className="schematic-layer layer-3">
        <svg viewBox="0 0 1000 1000" className="blueprint-svg blueprint-close">
          <polygon points="800,800 850,750 900,800 850,850" fill="none" stroke="rgba(234, 255, 150, 0.2)" strokeWidth="2" />
          <circle cx="850" cy="800" r="10" fill="rgba(234, 255, 150, 0.25)" />
          
          <path d="M 100 200 L 300 200 L 250 300 L 50 300 Z" fill="none" stroke="rgba(0, 255, 204, 0.15)" strokeWidth="1" />
          <line x1="50" y1="250" x2="300" y2="250" stroke="rgba(0, 255, 204, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
};

export default SchematicBackground;
