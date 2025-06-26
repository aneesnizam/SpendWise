import React from 'react';
import "./IntialLoader.css";

export default function IntialLoader() {
    return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spendwise-logo">
          <span className="logo-text">SpendWise</span>
          <div className="coin-container">
            <div className="coin">
              <div className="coin-face coin-front">
                <span className="coin-symbol">$</span>
              </div>
              <div className="coin-face coin-back">
                <span className="coin-symbol rupee-symbol">₹</span>
              </div>
            </div>
            <div className="coin-shadow"></div>
          </div>
        </div>
        <div className="loading-progress">
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
          <p className="loading-text">Calculating your savings...</p>
        </div>
      </div>
    </div>
  );
}
