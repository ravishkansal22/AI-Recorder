import React from 'react';

export default function RecorderControls({
  isPaused,
  onPauseToggle,
  onStopRecording,
  duration,
  harDual,
  setHarDual
}) {
  // Format duration (seconds) into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(1, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="active-controls-container">
      <div className="controls-row-top">
        <button className="stop-recording-btn" onClick={onStopRecording}>
          <span style={{ fontSize: '10px', marginRight: '4px' }}>■</span> Stop
        </button>
        <button 
          className={`control-icon-btn ${isPaused ? 'active-sim' : ''}`} 
          onClick={onPauseToggle}
          title={isPaused ? "Resume Recording" : "Pause Recording"}
        >
          {isPaused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>||</span>
          )}
        </button>
        <button className="control-icon-btn" title="Settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </button>
      </div>
      <div className="controls-row-bottom">
        <div className={`recording-status-badge ${!isPaused ? 'recording' : ''}`}>
          <span className="blink-dot" style={{ animationPlayState: isPaused ? 'paused' : 'running' }}></span>
          {isPaused ? "Paused" : `Recording... ${formatTime(duration)}`}
        </div>
        <div className="har-toggle-container">
          <span>HAR dual: {harDual ? 'ON' : 'OFF'}</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={harDual}
              onChange={(e) => setHarDual(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
