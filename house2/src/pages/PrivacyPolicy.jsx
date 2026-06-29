import React from 'react';
import GlassCard from '../components/GlassCard';
import SchematicBackground from '../components/SchematicBackground';
import bgLanding from '../assets/bg-landing.jpg';
import './LegalPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <div className="landing-bg" style={{ backgroundImage: `url(${bgLanding})`, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}></div>
      <SchematicBackground />
      <div className="landing-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      
      <GlassCard glowColor="cyan" className="legal-content">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <div className="riot-disclaimer">
          <p>
            <strong>Disclaimer:</strong> Vaload.me isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>

        <h2>1. Information We Collect</h2>
        <p>Vaload.me is designed with privacy in mind. The only information we collect when you use our service is:</p>
        <ul>
          <li><strong>Riot ID and Tagline:</strong> Used solely to fetch your match history and stats via an API.</li>
          <li><strong>Region Selection:</strong> Used to direct API queries to the correct regional servers.</li>
          <li><strong>Anonymous Usage Data:</strong> We may use basic analytics (like Vercel Analytics) to understand how the site is used, which does not track personally identifiable information.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>The information we collect is used entirely to provide the service to you in real-time. Specifically, your Riot ID is used to generate tactical insights and engagement maps of your recent VALORANT matches.</p>

        <h2>3. Zero Data Mining and No Permanent Storage</h2>
        <p>We pride ourselves on <strong>Zero Data Mining</strong>. We do not maintain a permanent database of your match history or player profile. Data fetched from the API is processed on-the-fly and is not stored permanently on our servers after your session.</p>

        <h2>4. Third-Party Services</h2>
        <p>We rely on a third-party API to provide our service. Data usage associated with VALORANT is governed by the <a href="https://www.riotgames.com/en/privacy-notice" target="_blank" rel="noreferrer">Riot Games Privacy Notice</a>.</p>
        <p>We may also use standard analytics providers (such as Vercel) which collect aggregate, anonymous data to help us improve the website.</p>

        <h2>5. Your Consent</h2>
        <p>By using our site, you consent to our online Privacy Policy.</p>

        <h2>6. Changes to Our Privacy Policy</h2>
        <p>If we decide to change our privacy policy, we will post those changes on this page.</p>

        <h2>7. Contact Us</h2>
        <p>If there are any questions regarding this privacy policy, you may contact us via the Feedback button or on X (Twitter) @slayzer0_0.</p>
      </GlassCard>
    </div>
  );
};

export default PrivacyPolicy;
