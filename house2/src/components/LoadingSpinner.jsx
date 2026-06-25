import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner-ring" />
      <p className="loading-text">Analyzing Playstyle...</p>
    </div>
  );
}
