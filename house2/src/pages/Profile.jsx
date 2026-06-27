import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import BracketCard from '../components/BracketCard';
import Heatmap from '../components/Heatmap';
import GlitchLoader from '../components/GlitchLoader';
import SchematicBackground from '../components/SchematicBackground';
import ErrorState from '../components/ErrorState';
import { ChevronLeft, Info } from 'lucide-react';
import { fetchAnalyze } from '../services/api';
import bgProfile from '../assets/bg-profile.webp';
import './Profile.css';

const Profile = () => {
  const { region, name, tag } = useParams();

  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activeMobileTooltip, setActiveMobileTooltip] = useState(null);

  const toggleTooltip = (id) => {
    setActiveMobileTooltip(prev => prev === id ? null : id);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnalyze(region, decodedName, decodedTag);
      setProfile(data.profile);
      setMetrics(data.metrics);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [region, name, tag]);

  // --- Loading state ---
  if (loading) return <GlitchLoader />;

  // --- Error state ---
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  // --- Extract metric data ---
  const tradeWindow = metrics?.trade_window || {};
  const ecoLiability = metrics?.eco_liability || {};
  const soloClutcher = metrics?.solo_clutcher || {};
  const firstBlood = metrics?.first_blood_velocity || {};
  const heatmapData = metrics?.engagement_heatmap || {};

  const currentRank = profile?.rank?.current_tier || 'Unranked';
  const currentRR = profile?.rank?.current_rr ?? '—';
  const cardImage = profile?.account?.card?.small || null;

  return (
    <div className="profile-container">
      {/* Background Image */}
      <div className="profile-bg" style={{ backgroundImage: `url(${bgProfile})` }}></div>
      <SchematicBackground />
      <div className="profile-overlay"></div>

      {/* Top Nav */}
      <nav className="profile-nav">
        <Link to="/" className="back-link">
          <ChevronLeft size={24} /> Back to Search
        </Link>
      </nav>

      <main className="profile-content">

        {/* Branching UI Container */}
        <div className="branching-hub">

          {/* SVG Lines connecting the 4 cards */}
          <svg className="connection-lines" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Top Left */}
            <g className="neon-cyan-line">
              <path d="M 430 250 L 330 150 L 260 150" className="svg-line" />
              <rect x="256" y="146" width="8" height="8" className="svg-dot" />
            </g>
            {/* Top Right */}
            <g className="neon-red-line">
              <path d="M 570 250 L 670 150 L 740 150" className="svg-line" />
              <rect x="736" y="146" width="8" height="8" className="svg-dot" />
            </g>
            {/* Bottom Left */}
            <g className="neon-yellow-line">
              <path d="M 430 350 L 330 450 L 260 450" className="svg-line" />
              <rect x="256" y="446" width="8" height="8" className="svg-dot" />
            </g>
            {/* Bottom Right */}
            <g className="neon-pink-line">
              <path d="M 570 350 L 670 450 L 740 450" className="svg-line" />
              <rect x="736" y="446" width="8" height="8" className="svg-dot" />
            </g>
          </svg>

          {/* Center Hub */}
          <div className="center-hub">
            <GlassCard glowColor="cyan" className="hub-card">
              <div className="player-rank">
                {cardImage ? (
                  <img src={cardImage} alt="Player card" className="rank-image" />
                ) : (
                  <div className="rank-placeholder"></div>
                )}
              </div>
              <h2 className="player-name">{decodedName}</h2>
              <span className="player-tag">#{decodedTag}</span>
              <div className="rank-info">
                <span className="rank-tier">{currentRank}</span>
                <span className="rank-rr">{currentRR} RR</span>
              </div>
            </GlassCard>
          </div>

          {/* Branch Cards — 4 total, symmetric layout */}
          <div className="branch-card card-top-left">
            <BracketCard color="cyan">
              <div className="card-title-row">
                <h4>Trade Window</h4>
              </div>
              <p className="verdict text-neon-cyan">{tradeWindow.verdict || '—'}</p>
              <span className="metric-detail">{Math.round((tradeWindow.trade_rate || 0) * 100)}% traded</span>
              
              <button className="mobile-info-btn" onClick={() => toggleTooltip('trade')}>
                <Info size={16} /> {activeMobileTooltip === 'trade' ? 'Close Info' : 'Info'}
              </button>

              <div className={`card-tooltip-content ${activeMobileTooltip === 'trade' ? 'mobile-visible' : ''}`}>
                Measures how often your deaths are traded by teammates (or you trade theirs).<br/><br/>
                <strong>Tags:</strong><br/>
                <span style={{color: 'var(--valo-cyan)'}}>Space Creator:</span> Trade rate ≥ 60%<br/>
                <span style={{color: 'var(--valo-red)'}}>Feeding:</span> Trade rate &lt; 30% & more deaths than kills<br/>
                <span style={{color: '#aaa'}}>Passive Trader:</span> Average trading activity
              </div>
            </BracketCard>
          </div>

          <div className="branch-card card-top-right">
            <BracketCard color="red">
              <div className="card-title-row">
                <h4>Eco-Liability</h4>
              </div>
              <p className="verdict text-neon-red">
                {(ecoLiability.wasted_credits || 0).toLocaleString()} Credits <span className="wasted-text">wasted</span>
              </p>
              <span className="metric-detail">{ecoLiability.liable_rounds || 0} liable rounds</span>
              
              <button className="mobile-info-btn" onClick={() => toggleTooltip('eco')}>
                <Info size={16} /> {activeMobileTooltip === 'eco' ? 'Close Info' : 'Info'}
              </button>

              <div className={`card-tooltip-content ${activeMobileTooltip === 'eco' ? 'mobile-visible' : ''}`}>
                Estimates the credit value of weapons dropped upon death during rounds your team lost economically.
              </div>
            </BracketCard>
          </div>

          <div className="branch-card card-bottom-left">
            <BracketCard color="yellow">
              <div className="card-title-row">
                <h4>Solo Clutcher</h4>
              </div>
              <p className="verdict text-neon-yellow">{Math.round((soloClutcher.clutch_rate || 0) * 100)}% Win Rate</p>
              <span className="metric-detail">{soloClutcher.clutch_wins || 0}/{soloClutcher.clutch_situations || 0} clutches</span>
              
              <button className="mobile-info-btn" onClick={() => toggleTooltip('solo')}>
                <Info size={16} /> {activeMobileTooltip === 'solo' ? 'Close Info' : 'Info'}
              </button>

              <div className={`card-tooltip-content ${activeMobileTooltip === 'solo' ? 'mobile-visible' : ''}`}>
                Your win rate in 1vX scenarios. Shows how reliable you are as the last player standing.
              </div>
            </BracketCard>
          </div>

          <div className="branch-card card-bottom-right">
            <BracketCard color="pink">
              <div className="card-title-row">
                <h4>First Blood Velocity</h4>
              </div>
              <p className="verdict text-neon-pink">{firstBlood.verdict || '—'}</p>
              <span className="metric-detail">{firstBlood.first_kills || 0} FK / {firstBlood.first_deaths || 0} FD</span>
              
              <button className="mobile-info-btn" onClick={() => toggleTooltip('firstblood')}>
                <Info size={16} /> {activeMobileTooltip === 'firstblood' ? 'Close Info' : 'Info'}
              </button>

              <div className={`card-tooltip-content ${activeMobileTooltip === 'firstblood' ? 'mobile-visible' : ''}`}>
                Evaluates your opening duel success.<br/><br/>
                <strong>Tags:</strong><br/>
                <span style={{color: 'var(--valo-pink)'}}>Hyper-Aggressive:</span> Fast engagements (&lt;15s) with high success<br/>
                <span style={{color: 'var(--valo-red)'}}>Passive Anchor:</span> Late engagements (&gt;45s) or more first deaths<br/>
                <span style={{color: '#aaa'}}>Methodical:</span> Balanced, mid-round engagements
              </div>
            </BracketCard>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="heatmap-section">
          <Heatmap data={heatmapData} />
        </div>

      </main>
    </div>
  );
};

export default Profile;
