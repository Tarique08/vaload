import React from 'react';
import GlassCard from '../components/GlassCard';
import SchematicBackground from '../components/SchematicBackground';
import bgLanding from '../assets/bg-landing.jpg';
import './LegalPage.css';

const TermsOfService = () => {
  return (
    <div className="legal-container">
      <div className="landing-bg" style={{ backgroundImage: `url(${bgLanding})`, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}></div>
      <SchematicBackground />
      <div className="landing-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      
      <GlassCard glowColor="red" className="legal-content">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <div className="riot-disclaimer">
          <p>
            <strong>Disclaimer:</strong> Vaload.me isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Vaload.me, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the website or use any services.</p>

        <h2>2. Description of Service</h2>
        <p>Vaload.me provides detailed playstyle data and tactical insights (such as engagement maps) for the video game VALORANT. The service is provided "as is" and is free of charge. We reserve the right to modify or discontinue the service at any time without notice.</p>

        <h2>3. User Data and Accounts</h2>
        <p>Vaload.me does not require user registration. We fetch data using the official Riot Games API based on the Riot ID and Tagline you provide. We do not permanently store your match data on our servers.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to use the service for any illegal or unauthorized purpose. You must not attempt to hack, destabilize, or adapt the website.</p>

        <h2>5. Intellectual Property</h2>
        <p>All game assets, logos, and trademarks related to VALORANT are the property of Riot Games, Inc. Vaload.me claims no ownership over these assets.</p>

        <h2>6. Limitation of Liability</h2>
        <p>In no event shall Vaload.me or its creators be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of this service.</p>

        <h2>7. Changes to Terms</h2>
        <p>We may update our Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page.</p>

        <h2>8. Contact</h2>
        <p>If you have any questions about these Terms, please reach out via the Feedback button or on X (Twitter) @slayzer0_0.</p>
      </GlassCard>
    </div>
  );
};

export default TermsOfService;
