import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import FeedbackModal from './components/FeedbackModal';
import './App.css';

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <div className="top-nav-container">
        <a href="https://x.com/slayzer0_0" target="_blank" rel="noreferrer" className="x-profile-link">
          made by @slayzer0_0
        </a>
        <button 
          className="global-feedback-btn" 
          onClick={() => setIsFeedbackOpen(true)}
          aria-label="Send Feedback"
        >
          <Inbox size={18} />
          <span className="feedback-btn-text">Feedback</span>
        </button>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile/:region/:name/:tag" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
