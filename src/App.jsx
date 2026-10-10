import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ResumeSetup from './components/ResumeSetup';
import InterviewRoom from './components/InterviewRoom';
import ReportDashboard from './components/ReportDashboard';
import SettingsModal from './components/SettingsModal';
import SecurityModal from './components/SecurityModal';
import { AIInterviewerSession } from './services/aiInterviewerService';
import { SpeechManager } from './services/speechService';
import { generateEvaluationReport } from './services/evaluationEngine';
import { resumeCacheSecurity } from './services/resumeCacheSecurity';
import './index.css';

export default function App() {
  const [currentStage, setCurrentStage] = useState('setup'); // 'setup' | 'interview' | 'report'
  const [candidateProfile, setCandidateProfile] = useState(() => {
    return resumeCacheSecurity.getCachedResume();
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('lti_gemini_key') || '';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Initialize SpeechManager
  const speechManager = useMemo(() => {
    return new SpeechManager();
  }, []);

  useEffect(() => {
    speechManager.setMuted(isMuted);
  }, [isMuted, speechManager]);

  const handleStartInterview = (profile, role) => {
    setCandidateProfile(profile);
    setSelectedRole(role);
    const newSession = new AIInterviewerSession(profile, role, geminiApiKey);
    setSession(newSession);
    setCurrentStage('interview');
  };

  const handleFinishInterview = () => {
    if (speechManager) {
      speechManager.stopSpeaking();
      speechManager.stopListening();
    }
    if (session) {
      const evaluation = generateEvaluationReport(session);
      setReportData(evaluation);
      setCurrentStage('report');
    }
  };

  const handleRetake = () => {
    if (candidateProfile && selectedRole) {
      const freshSession = new AIInterviewerSession(candidateProfile, selectedRole, geminiApiKey);
      setSession(freshSession);
      setCurrentStage('interview');
    }
  };

  const handleReset = () => {
    if (speechManager) {
      speechManager.stopSpeaking();
      speechManager.stopListening();
    }
    setCurrentStage('setup');
    setSession(null);
    setReportData(null);
  };

  const handlePurged = () => {
    setCandidateProfile(null);
    handleReset();
  };

  const handleSaveGeminiKey = (newKey) => {
    setGeminiApiKey(newKey);
    localStorage.setItem('lti_gemini_key', newKey);
  };

  return (
    <div className="app-root">
      <Navbar 
        currentStage={currentStage}
        onReset={handleReset}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSecurity={() => setSecurityOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        hasCustomKey={Boolean(geminiApiKey)}
        selectedRole={selectedRole}
        isResumeCached={Boolean(candidateProfile)}
      />

      <main className="main-content-area">
        {currentStage === 'setup' && (
          <ResumeSetup 
            onStartInterview={handleStartInterview} 
            onProfileCached={(p) => setCandidateProfile(p)}
          />
        )}

        {currentStage === 'interview' && session && (
          <InterviewRoom 
            session={session}
            speechManager={speechManager}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onFinishInterview={handleFinishInterview}
          />
        )}

        {currentStage === 'report' && reportData && (
          <ReportDashboard 
            reportData={reportData}
            onRetake={handleRetake}
            onNewResume={handleReset}
          />
        )}
      </main>

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        geminiKey={geminiApiKey}
        onSaveKey={handleSaveGeminiKey}
      />

      <SecurityModal 
        isOpen={securityOpen}
        onClose={() => setSecurityOpen(false)}
        onPurged={handlePurged}
      />
    </div>
  );
}
