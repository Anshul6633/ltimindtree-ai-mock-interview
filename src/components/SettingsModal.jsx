import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, Check } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  geminiKey, 
  onSaveKey 
}) {
  const [keyInput, setKeyInput] = useState(geminiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Key size={20} className="modal-icon" />
            <h3>AI Engine & Configuration</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="engine-info-box">
            <Sparkles size={18} className="info-icon" />
            <div>
              <strong>Built-in LTIMindtree Engine Active</strong>
              <p>
                By default, this platform uses an integrated heuristic NLP engine calibrated to LTIMindtree competency rubrics. 
                Entering an optional Google Gemini API key enables direct real-time LLM critique.
              </p>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="gemini-key-input">Optional Google Gemini API Key:</label>
            <input 
              id="gemini-key-input"
              type="password"
              placeholder="AIzaSy..."
              className="key-input"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <span className="key-hint">
              Keys are stored securely in your browser session only and never sent to external servers.
            </span>
          </div>

          {savedSuccess && (
            <div className="save-success-pill">
              <Check size={16} /> Key settings updated successfully!
            </div>
          )}
        </div>

        <div className="modal-footer">
          {keyInput && (
            <button type="button" className="btn-secondary" onClick={handleClear}>
              Clear Key
            </button>
          )}
          <button type="button" className="btn-accent" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
