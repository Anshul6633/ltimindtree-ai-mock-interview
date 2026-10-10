import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ResumeSetup from './components/ResumeSetup';
import InterviewRoom from './components/InterviewRoom';
import ReportDashboard from './components/ReportDashboard';
import SettingsModal from './components/SettingsModal';
import { AIInterviewerSession } from './services/aiInterviewerService';
import { SpeechManager } from './services/speechService';
import { generateEvaluationReport } from './services/evaluationEngine';
import './index.css';

export default function App() {
  const [currentStage, setCurrentStage] = useState('setup'); // 'setup' | 'interview' | 'report'
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('lti_gemini_key') || '';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        hasCustomKey={Boolean(geminiApiKey)}
        selectedRole={selectedRole}
      />

      <main className="main-content-area">
        {currentStage === 'setup' && (
          <ResumeSetup onStartInterview={handleStartInterview} />
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
    </div>
  );
}
