import React from 'react';

export default function RecordedSteps({ steps = [], isRecordingActive = false }) {
  return (
    <div className="steps-container">
      <div className="steps-header">Captured Steps</div>
      
      {steps.length === 0 && !isRecordingActive && (
        <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          No steps captured. Start recording or enter a URL above.
        </div>
      )}

      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        
        // Check for specific variants
        const isSelfHealed = step.type === 'Click' && step.selfHealed;
        const isAssertUrl = step.type === 'Assert URL';
        
        let cardClass = 'step-card';
        if (isSelfHealed) cardClass += ' self-healed';
        if (isAssertUrl) cardClass += ' url-check';
        
        return (
          <div key={step.id || idx} className={cardClass}>
            <div className="step-number-badge">
              {stepNum}
            </div>
            
            <div className="step-content">
              <div className="step-title-row">
                <span className="step-type-bold">{step.type}</span>
                
                {step.type === 'Navigate' && (
                  <span className="step-badge get">GET</span>
                )}
                
                {step.type === 'Type' && step.param && (
                  <span className="step-badge param">{step.param}</span>
                )}
                
                {step.type === 'Assert' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                
                {isSelfHealed && (
                  <span className="step-healed-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px' }}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Self-Healed
                  </span>
                )}
              </div>
              
              <div className="step-details">
                {step.details}
              </div>
            </div>
          </div>
        );
      })}

      {isRecordingActive && (
        <div className="step-card waiting-placeholder">
          <span className="spinner"></span>
          Waiting for action...
        </div>
      )}
    </div>
  );
}
