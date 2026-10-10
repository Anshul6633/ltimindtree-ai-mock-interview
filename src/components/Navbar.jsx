import React from 'react';
import { Volume2, VolumeX, Key, RotateCcw, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function Navbar({ 
  currentStage, 
  onReset, 
  onOpenSettings, 
  isMuted, 
  onToggleMute, 
  hasCustomKey,
  selectedRole 
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div className="brand-group" onClick={onReset} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">
            <Building2 className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-name">LTIMindtree</span>
              <span className="brand-tag">AI MOCK INTERVIEW</span>
            </div>
            <p className="brand-subtitle">Resume-Driven Enterprise Tech & HR Simulator</p>
          </div>
        </div>

        {/* Center Role Badge (if in interview) */}
        {selectedRole && (
          <div className="nav-role-badge">
            <span className="role-dot" style={{ backgroundColor: selectedRole.badgeColor }}></span>
            <span className="role-text">{selectedRole.title}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Audio toggle */}
          <button 
            className={`nav-icon-btn ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
            aria-label="Toggle voice"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="btn-label">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          {/* Settings / API Key */}
          <button 
            className={`nav-icon-btn ${hasCustomKey ? 'has-key' : ''}`}
            onClick={onOpenSettings}
            title="Configure Gemini API Key"
          >
            <Key size={18} />
            <span className="btn-label">{hasCustomKey ? 'Gemini Active' : 'AI Engine'}</span>
          </button>

          {/* Reset / New Session */}
          {currentStage !== 'setup' && (
            <button 
              className="nav-btn-secondary"
              onClick={onReset}
              title="Start a new interview"
            >
              <RotateCcw size={16} />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
