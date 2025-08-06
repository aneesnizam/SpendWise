// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footerContainer}>
      © 2025 Spend Wise ·{" "}
      <a href="/privacy-policy" style={styles.footerLink}>
        Privacy Policy
      </a>
    </footer>
  );
};

const styles = {
  footerContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
    padding: '20px',
    color: '#4a5568',
    background: 'linear-gradient(145deg, #e0e5ec, #f0f5fc)',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: '0.9rem',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.02)',
    width: '100%',
    boxSizing: 'border-box'
  },
  footerLink: {
    color: '#ff8c42',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    ':hover': {
      color: '#ff6b21',
      textDecoration: 'underline'
    }
  },
  // Media queries need to be handled differently in inline styles
  // Typically you'd use a CSS-in-JS library for this, but for plain React:
  '@media (max-width: 768px)': {
    footerContainer: {
      padding: '15px',
      fontSize: '0.8rem'
    }
  }
};

// Helper function to handle media queries in inline styles
const applyMediaQueries = (styles) => {
  const result = {...styles};
  delete result['@media (max-width: 768px)'];
  return result;
};

export default Footer;