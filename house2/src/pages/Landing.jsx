import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import SchematicBackground from '../components/SchematicBackground';
import bgLanding from '../assets/bg-landing.jpg';
import ehEg from '../assets/decorations/eh_eg.png';
import tiEg from '../assets/decorations/ti_eg.png';
import './Landing.css';

const Landing = () => {
  const [gameName, setGameName] = useState('');
  const [tagline, setTagline] = useState('');
  const [region, setRegion] = useState('ap');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (gameName && tagline) {
      // Strip # if user included it
      const cleanTag = tagline.replace('#', '');
      navigate(`/profile/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(cleanTag)}`);
    }
  };

  return (
    <div className="landing-container">
      {/* Background Image */}
      <div className="landing-bg" style={{ backgroundImage: `url(${bgLanding})` }}></div>
      <SchematicBackground />
      <div className="landing-overlay"></div>

      <main className="landing-content">
        {/* Left Banners */}
        <div className="side-banners left-banners">
          <GlassCard glowColor="red" className="banner-card">
            <h3>Recent Matches</h3>
            <p>Get detailed playstyle data of your past 10 competitive matches.</p>
          </GlassCard>
          <GlassCard glowColor="cyan" className="banner-card mt-4">
            <h3>Tactical Insights</h3>
            <div className="mini-map-image-container" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              <img src={tiEg} alt="Tactical Insights Example" style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(0, 255, 204, 0.3)' }} />
            </div>
            <p className="text-sm mt-2">Get tactical insights which tracker.gg can't fetch.</p>
          </GlassCard>
        </div>

        {/* Center Console */}
        <div className="center-console">
          <GlassCard glowColor="yellow" className="search-card">
            <h1 className="text-neon-cyan title">VALOAD</h1>
            <p className="subtitle">The Ghost Architecture Tracker</p>

            <form onSubmit={handleSearch} className="search-form">
              <div className="input-group">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="region-select"
                >
                  <option value="ap">AP</option>
                  <option value="na">NA</option>
                  <option value="eu">EU</option>
                  <option value="kr">KR</option>
                </select>
                <input
                  type="text"
                  placeholder="GAMENAME"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  required
                  className="search-input"
                />
                <span className="tag-separator">#</span>
                <input
                  type="text"
                  placeholder="TAGLINE"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  className="search-input tagline-input"
                />
              </div>

              <NeonButton type="submit" color="red" className="search-btn">
                Analyze Playstyle
              </NeonButton>
            </form>
          </GlassCard>
        </div>

        {/* Right Banners */}
        <div className="side-banners right-banners">
          <GlassCard glowColor="cyan" className="banner-card">
            <h3>Engagement Maps</h3>
            <div className="mini-map-image-container" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              <img src={ehEg} alt="Engagement Heatmap" style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(0, 255, 204, 0.3)' }} />
            </div>
            <p className="text-sm mt-2">Visualize your positioning</p>
          </GlassCard>
          <GlassCard glowColor="red" className="banner-card mt-4">
            <h3>Zero Data Mining</h3>
            <p>All completely free. No ads. No permanent database tracking.</p>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Landing;
