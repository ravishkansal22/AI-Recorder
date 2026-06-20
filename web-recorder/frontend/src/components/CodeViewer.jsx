import React, { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';

// Configure Monaco editor path if needed, usually default works
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/min/vs' } });

export default function CodeViewer({
  code,
  framework,
  setFramework,
  onCodeChange
}) {
  const [isMonacoReady, setIsMonacoReady] = useState(false);

  const frameworks = [
    { id: 'playwright', label: 'Playwright' },
    { id: 'selenium', label: 'Selenium Java' },
    { id: 'cypress', label: 'Cypress' },
    { id: 'puppeteer', label: 'Puppeteer' }
  ];

  const handleEditorWillMount = (monaco) => {
    // Define the custom dark theme matching the screenshot
    monaco.editor.defineTheme('scriptstudio-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: 'fbbf24' },
        { token: 'identifier', foreground: 'ffffff' },
        { token: 'type', foreground: '34d399' },
        { token: 'number', foreground: 'f97316' },
        { token: 'delimiter', foreground: '94a3b8' },
      ],
      colors: {
        'editor.background': '#121212',
        'editor.foreground': '#e2e8f0',
        'editorCursor.foreground': '#208056',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#cbd5e1',
        'editor.selectionBackground': '#334155',
        'scrollbarSlider.background': '#33415580',
        'scrollbarSlider.hoverBackground': '#475569cc',
        'scrollbarSlider.activeBackground': '#64748bcc',
      }
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    setIsMonacoReady(true);
  };

  const getLanguage = (fw) => {
    if (fw === 'selenium') return 'java';
    if (fw === 'playwright') return 'typescript';
    return 'javascript';
  };

  return (
    <div className="main-panel">
      <div className="panel-header">
        <div className="framework-tabs">
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              className={`framework-tab ${framework === fw.id ? 'active' : ''}`}
              onClick={() => setFramework(fw.id)}
            >
              {fw.label}
            </button>
          ))}
        </div>
        
        <div className="panel-actions">
          <button className="action-small-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Parametrize
          </button>
          <button className="action-small-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            Data Gen
          </button>
          <button className="action-small-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            Migrate
          </button>
          <button className="action-small-btn ai-btn">
            <span style={{ fontSize: '12px', marginRight: '2px', fontWeight: 'bold' }}>+</span>
            AI
          </button>
        </div>
      </div>
      
      <div className="editor-container">
        {/* Monaco Editor */}
        <Editor
          height="100%"
          language={getLanguage(framework)}
          value={code}
          onChange={onCodeChange}
          theme="scriptstudio-theme"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          loading={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#64748b',
              backgroundColor: '#121212',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              gap: '10px'
            }}>
              <span className="spinner"></span>
              Initializing Monaco Editor...
            </div>
          }
          options={{
            readOnly: false,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Fira Code', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
        />
      </div>
    </div>
  );
}
