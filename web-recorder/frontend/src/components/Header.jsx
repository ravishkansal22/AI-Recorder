import React from 'react';

export default function Header() {
  return (
    <header className="global-header">
      <div className="header-left">
        <span className="app-logo">Script Studio</span>
        <div className="divider"></div>
        <span className="project-name">E-Commerce Checkout</span>
      </div>
      <div className="header-right">
        <button className="pill-btn rdd-active">
          RDD Active
        </button>
        <button className="pill-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Locator Inspector
        </button>
        <button className="pill-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Heal All
        </button>
        <button className="pill-btn purple-btn">
          <span style={{ fontSize: '14px', marginRight: '4px', fontWeight: 'bold' }}>+</span>
          AI Assertions
        </button>
        <button className="pill-btn green-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Scripts
        </button>
      </div>
    </header>
  );
}
