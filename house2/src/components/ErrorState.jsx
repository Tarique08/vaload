import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import './ErrorState.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-card">
        <AlertTriangle className="error-icon" size={48} />
        <p className="error-message">{message}</p>
        <div className="error-actions">
          {onRetry && (
            <button className="retry-btn" onClick={onRetry}>
              Try Again
            </button>
          )}
          <Link to="/" className="back-link">
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
