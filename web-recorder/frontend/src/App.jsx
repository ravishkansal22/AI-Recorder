import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import RecorderControls from './components/RecorderControls';
import RecordedSteps from './components/RecordedSteps';
import CodeViewer from './components/CodeViewer';
import { useRecorder } from './hooks/useRecorder';
import { generateCode } from './utils/codeGenerators';

export default function App() {
  const {
    steps,
    isRecording,
    isPaused,
    duration,
    harDual,
    setHarDual,
    targetUrl,
    setTargetUrl,
    isConnected,
    isSimulation,
    setIsSimulation,
    startRecording,
    stopRecording,
    togglePause,
    addManualStep,
    simulateNextStep,
    resetSimulation
  } = useRecorder();

  // App Layout States
  const [activeMode, setActiveMode] = useState('automation'); // automation, performance, security, accessibility
  const [envMode, setEnvMode] = useState('headed'); // headed, headless
  const [sidebarTab, setSidebarTab] = useState('record'); // record, prompt, crawl, logs
  const [framework, setFramework] = useState('playwright'); // playwright, selenium, cypress, puppeteer
  
  // Custom edited code state (in case user types in editor)
  const [code, setCode] = useState('');

  // Update generated code when steps or framework changes
  useEffect(() => {
    const generated = generateCode(steps, framework);
    setCode(generated);
  }, [steps, framework]);

  const handleStartRecording = (url) => {
    startRecording(url);
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Human readable timer for secondary bar
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(1, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="app-container">
      {/* 1. Global Header Bar */}
      <Header />

      {/* 2. Secondary Control Bar */}
      <div className="secondary-bar">
        {/* Left: Mode selection tabs */}
        <div className="modes-tabs">
          <button
            className={`mode-tab ${activeMode === 'automation' ? 'active' : ''}`}
            onClick={() => setActiveMode('automation')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
            </svg>
            Automation
          </button>
          
          <button
            className={`mode-tab ${activeMode === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveMode('performance')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Performance
          </button>

          <button
            className={`mode-tab ${activeMode === 'security' ? 'active' : ''}`}
            onClick={() => setActiveMode('security')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Security
          </button>

          <button
            className={`mode-tab ${activeMode === 'accessibility' ? 'active' : ''}`}
            onClick={() => setActiveMode('accessibility')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
              <path d="M8 12h8"></path>
              <path d="M12 12v6"></path>
              <path d="M9 20l3-2 3 2"></path>
            </svg>
            Accessibility
          </button>
        </div>

        {/* Center: Headed / Headless toggles */}
        <div className="environment-toggles">
          <button
            className={`toggle-btn ${envMode === 'headed' ? 'active' : ''}`}
            onClick={() => setEnvMode('headed')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
            </svg>
            Headed (Debug)
          </button>
          <button
            className={`toggle-btn ${envMode === 'headless' ? 'active' : ''}`}
            onClick={() => setEnvMode('headless')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            Headless (CI)
          </button>
        </div>

        {/* Right: Live recording indicator */}
        <div className="recording-live-indicator">
          {isRecording && !isPaused && (
            <>
              <span className="blink-dot"></span>
              Recording {formatTime(duration)}
            </>
          )}
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="workspace-body">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          {/* Top Horizontal sub tabs */}
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${sidebarTab === 'record' ? 'active' : ''}`}
              onClick={() => setSidebarTab('record')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
              </svg>
              Record
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setSidebarTab('prompt')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Prompt
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === 'crawl' ? 'active' : ''}`}
              onClick={() => setSidebarTab('crawl')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              Crawl
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === 'logs' ? 'active' : ''}`}
              onClick={() => setSidebarTab('logs')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Prod Logs
            </button>
          </div>

          {/* Pre-recording vs Active recording controls */}
          {sidebarTab === 'record' && (
            <>
              {!isRecording ? (
                <UrlInput
                  url={targetUrl}
                  setUrl={setTargetUrl}
                  onStartRecording={handleStartRecording}
                />
              ) : (
                <RecorderControls
                  isPaused={isPaused}
                  onPauseToggle={togglePause}
                  onStopRecording={handleStopRecording}
                  duration={duration}
                  harDual={harDual}
                  setHarDual={setHarDual}
                />
              )}
            </>
          )}

          {/* Captured Steps Panel */}
          <RecordedSteps
            steps={steps}
            isRecordingActive={isRecording && !isPaused}
          />
        </aside>

        {/* Right Main Panel: Code Canvas */}
        <CodeViewer
          code={code}
          framework={framework}
          setFramework={setFramework}
          onCodeChange={handleCodeChange}
        />

        {/* Floating Simulation Helper (shown only when in simulation and recording) */}
        {isRecording && isSimulation && (
          <div className="simulator-panel">
            <div className="sim-header">Simulation Mode</div>
            <div className="sim-desc">
              No server detected. Running client-side simulation. Steps are auto-generated, or trigger manually:
            </div>
            <button 
              className="sim-btn" 
              onClick={simulateNextStep}
              disabled={steps.length >= 6}
              style={{
                backgroundColor: steps.length >= 6 ? '#f1f5f9' : '#e6f4ea',
                borderColor: steps.length >= 6 ? '#cbd5e1' : '#bbf7d0',
                color: steps.length >= 6 ? '#94a3b8' : '#166534',
                fontWeight: '600'
              }}
            >
              {steps.length >= 6 ? "✓ Simulation Complete" : "+ Simulate Next Action"}
            </button>
            <button 
              className="sim-btn" 
              onClick={resetSimulation}
              style={{
                fontSize: '11px',
                textAlign: 'center',
                color: '#ef4444',
                borderColor: '#fee2e2'
              }}
            >
              Reset Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
