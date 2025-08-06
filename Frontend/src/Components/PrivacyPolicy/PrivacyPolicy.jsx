
import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container" >
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-text">
        Your privacy is important to us. This Privacy Policy explains how Spend Wise collects and uses information when you use our website.
      </p>

      <h2 className="privacy-subtitle">1. Use of Google Analytics</h2>
      <p className="privacy-text">
        We use Google Analytics to understand how visitors interact with our site. Google Analytics uses cookies to collect data such as your IP address, browser type, and pages visited. This data helps us improve the performance and usability of Spend Wise.
      </p>
      <p className="privacy-text">
        To learn how Google uses data when you use our site, visit:{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          className="privacy-link"
        >
          How Google uses data
        </a>
      </p>

      <h2 className="privacy-subtitle">2. Use of Cookies</h2>
      <p className="privacy-text">
        Spend Wise uses cookies to store user preferences, track sessions, and analyze traffic patterns. You can manage or disable cookies through your browser settings.
      </p>

      <h2 className="privacy-subtitle">3. Data Security</h2>
      <p className="privacy-text">
        We do not sell or share personally identifiable information. Data collected is used only to improve the service and understand user behavior.
      </p>

      <h2 className="privacy-subtitle">4. Contact</h2>
   <p className="privacy-text"> If you have any questions or concerns regarding this Privacy Policy, please refer to our Help Center or contact our support team. </p>
    </div>
  );
};

export default PrivacyPolicy;
