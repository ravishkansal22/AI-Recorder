import React from 'react';

export default function UrlInput({ url, setUrl, onStartRecording }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onStartRecording(url);
    }
  };

  return (
    <div className="pre-recording-container">
      <form onSubmit={handleSubmit} className="form-group">
        <label className="form-label">Target URL</label>
        <div className="url-input-wrapper">
          <input
            type="text"
            className="url-input-field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://shop.example.com/checkout"
          />
        </div>
        <button type="submit" className="start-recording-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
          </svg>
          Start Recording
        </button>
      </form>
    </div>
  );
}
