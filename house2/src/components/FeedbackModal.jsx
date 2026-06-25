import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';
import { submitFeedback } from '../services/api';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('loading');

    try {
      await submitFeedback(message, email);

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
        setEmail('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-content" onClick={(e) => e.stopPropagation()}>
        <GlassCard glowColor="cyan" className="feedback-card">
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
          
          <h2 className="feedback-title text-neon-cyan">Feedback</h2>
          <p className="feedback-subtitle">Found a bug or have a suggestion? Let us know!</p>

          {status === 'success' ? (
            <div className="feedback-success text-neon-cyan">
              <p>Thanks for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <textarea
                className="feedback-textarea"
                placeholder="Your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
              />
              <input
                type="email"
                className="feedback-input"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <NeonButton type="submit" color="cyan" className="feedback-submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : (
                  <>
                    <Send size={16} /> Send Feedback
                  </>
                )}
              </NeonButton>
              
              {status === 'error' && (
                <p className="feedback-error text-neon-red">Failed to send. Please try again.</p>
              )}
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default FeedbackModal;
