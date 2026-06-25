import React, { useState, useEffect } from 'react';
import './GlitchLoader.css';

const LOADING_PHRASES = [
  'UPLINKING TO KINGDOM SERVERS...',
  'CALIBRATING RADIANT SIGNATURES...',
  'ANALYZING COMBAT TACTICS...',
  'FETCHING MATCH HISTORY...',
];

const GlitchLoader = () => {
  const [displayText, setDisplayText] = useState(LOADING_PHRASES[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_PHRASES.length;
      setDisplayText(LOADING_PHRASES[index]);
    }, 600); // Change phrase every 600ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glitch-loader-container">
      <div className="glitch-wrapper">
        <h2 className="glitch-text" data-text={displayText}>
          {displayText}
        </h2>
        <div className="cyber-progress-bar">
          <div className="cyber-progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default GlitchLoader;
