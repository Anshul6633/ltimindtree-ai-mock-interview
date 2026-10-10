import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Lock, Trash2, Cpu, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { resumeCacheSecurity } from '../services/resumeCacheSecurity.js';

export default function SecurityModal({ isOpen, onClose, onPurged }) {
  const [status, setStatus] = useState(resumeCacheSecurity.getCacheSecurityStatus());
  const [purgedMessage, setPurgedMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(resumeCacheSecurity.getCacheSecurityStatus());
      setPurgedMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePurge = () => {
    resumeCacheSecurity.purgeResumeCache();
    setStatus(resumeCacheSecurity.getCacheSecurityStatus());
    setPurgedMessage(true);
    if (onPurged) onPurged();
    setTimeout(() => {
      setPurgedMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card security-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <ShieldCheck size={22} className="shield-icon-glow" />
            <div>
              <h3>Student Resume Security & Cache Center</h3>
              <p className="modal-header-sub">Zero-Database In-Memory Privacy Architecture</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Security Banner */}
          <div className="security-banner-callout">
            <Lock size={20} className="lock-icon" />
            <div>
              <strong>100% Client-Side In-Memory Cache</strong>
              <p>
                Student resumes are loaded strictly into volatile browser memory (RAM) and temporary session storage. 
                No resume is ever written to an external database, eliminating database connection bottlenecks and data breach risks for high-volume campus hiring.
              </p>
            </div>
          </div>

          {/* Diagnostic Stats Grid */}
          <div className="security-stats-grid">
            <div className="sec-stat-item">
              <span className="sec-stat-label">Cache Memory Location</span>
              <span className="sec-stat-value highlight">{status.storageType}</span>
            </div>
            <div className="sec-stat-item">
              <span className="sec-stat-label">Database Server Load</span>
              <span className="sec-stat-value success">{status.dbLoadMitigation}</span>
            </div>
            <div className="sec-stat-item">
              <span className="sec-stat-label">PII Protection Protocol</span>
              <span className="sec-stat-value success">{status.piiProtection}</span>
            </div>
            <div className="sec-stat-item">
              <span className="sec-stat-label">RAM Memory Footprint</span>
              <span className="sec-stat-value">{status.memoryFootprint}</span>
            </div>
            <div className="sec-stat-item">
              <span className="sec-stat-label">Memory Integrity Hash</span>
              <span className="sec-stat-value mono">{status.integrityHash}</span>
            </div>
            <div className="sec-stat-item">
              <span className="sec-stat-label">Auto-Purge Lifecycle</span>
              <span className="sec-stat-value">Automatic upon browser tab closure</span>
            </div>
          </div>

          {purgedMessage && (
            <div className="save-success-pill">
              <CheckCircle2 size={16} /> Resume data completely wiped from in-memory cache!
            </div>
          )}
        </div>

        <div className="modal-footer security-modal-footer">
          {status.isCached && (
            <button type="button" className="purge-cache-btn" onClick={handlePurge}>
              <Trash2 size={16} /> Purge Resume from Memory Cache
            </button>
          )}
          <button type="button" className="btn-accent" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
