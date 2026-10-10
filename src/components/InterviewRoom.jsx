import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, HelpCircle, ArrowRight, Clock, 
  Volume2, VolumeX, AlertCircle, Sparkles, Check, 
  MessageSquare, ChevronDown, ChevronUp, Bot, User, 
  StopCircle, Keyboard, Play, RefreshCw, Radio
} from 'lucide-react';

export default function InterviewRoom({ 
  session, 
  speechManager, 
  isMuted, 
  onToggleMute, 
  onFinishInterview 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text'
  const [candidateText, setCandidateText] = useState('');
  const [interimSpeech, setInterimSpeech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [botStatus, setBotStatus] = useState('speaking'); // 'speaking' | 'waiting_for_user' | 'analyzing'
  const [interviewerFeedback, setInterviewerFeedback] = useState(null);

  const textareaRef = useRef(null);

  // Initialize and auto-read question when index changes
  useEffect(() => {
    const q = session.getCurrentQuestion();
    setCurrentQuestion(q);
    setShowHint(false);
    setCandidateText('');
    setInterimSpeech('');
    setInterviewerFeedback(null);

    if (q) {
      setBotStatus('speaking');
      if (speechManager && !isMuted) {
        // AI reads question aloud clearly
        speechManager.speak(q.question, () => {
          setBotStatus('waiting_for_user');
        });
      } else {
        setTimeout(() => setBotStatus('waiting_for_user'), 1400);
      }
    }
  }, [session.currentQuestionIndex, isMuted, speechManager]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hook speech manager callbacks
  useEffect(() => {
    if (!speechManager) return;

    speechManager.onTranscriptUpdate = ({ finalTranscript, interimTranscript }) => {
      if (interimTranscript) {
        setInterimSpeech(interimTranscript);
      }
      if (finalTranscript) {
        setCandidateText(prev => {
          const combined = (prev + ' ' + finalTranscript).trim();
          return combined;
        });
        setInterimSpeech('');
      }
    };

    speechManager.onStatusChange = (status) => {
      if (status.isListening !== undefined) {
        setIsListening(status.isListening);
      }
      if (status.isSpeaking !== undefined) {
        if (status.isSpeaking) {
          setBotStatus('speaking');
        } else if (botStatus === 'speaking') {
          setBotStatus('waiting_for_user');
        }
      }
      if (status.error) {
        setSpeechError(status.error);
      }
    };
  }, [speechManager, botStatus]);

  const handleToggleVoice = () => {
    if (!speechManager) return;
    setSpeechError('');
    if (isListening) {
      speechManager.stopListening();
    } else {
      // Ensure AI stops speaking before candidate talks
      speechManager.stopSpeaking();
      speechManager.startListening();
    }
  };

  const handleReplayQuestion = () => {
    if (!currentQuestion || !speechManager) return;
    if (isListening) speechManager.stopListening();
    setBotStatus('speaking');
    speechManager.speak(currentQuestion.question, () => {
      setBotStatus('waiting_for_user');
    });
  };

  const handleSubmitAnswer = async () => {
    const fullText = (candidateText + ' ' + interimSpeech).trim();
    if (!fullText || isSubmitting) return;

    if (isListening && speechManager) {
      speechManager.stopListening();
    }
    if (speechManager) {
      speechManager.stopSpeaking();
    }

    setIsSubmitting(true);
    setBotStatus('analyzing');

    try {
      const result = await session.submitCandidateAnswer(fullText);
      setInterviewerFeedback(result.critique);

      // Play panel reaction transition
      if (result.interviewerReaction && speechManager && !isMuted) {
        speechManager.speak(result.interviewerReaction);
      }

      if (result.isFinished) {
        setTimeout(() => {
          onFinishInterview();
        }, 1200);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
      setCandidateText('');
      setInterimSpeech('');
    }
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalWords = (candidateText + ' ' + interimSpeech).trim() 
    ? (candidateText + ' ' + interimSpeech).trim().split(/\s+/).length 
    : 0;

  const progressPercent = Math.round(((session.currentQuestionIndex + 1) / session.totalQuestions) * 100);

  return (
    <div className="interview-room-container">
      {/* Top Session Progress Bar */}
      <div className="interview-top-bar">
        <div className="interview-step-indicator">
          <span className="step-badge">
            Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
          </span>
          <span className="stage-name">{currentQuestion?.title}</span>
        </div>

        <div className="progress-bar-wrapper">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="interview-meta-right">
          <div className="timer-badge">
            <Clock size={16} />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button 
            type="button" 
            className="end-early-btn"
            onClick={onFinishInterview}
            title="Conclude early and view evaluation report"
          >
            Finish & View Report
          </button>
        </div>
      </div>

      <div className="interview-main-layout">
        {/* Left Column: AI Interviewer Persona & Audio Wave */}
        <div className="interviewer-panel-card">
          <div className="interviewer-avatar-wrapper">
            <div className={`avatar-aura ${botStatus}`}></div>
            <div className="interviewer-avatar">
              <Bot size={44} className="bot-icon" />
            </div>

            {/* Live status badge */}
            <div className={`status-pill ${botStatus}`}>
              <span className="status-indicator-dot"></span>
              <span className="status-text">
                {botStatus === 'speaking' && '🔊 AI Reading Question...'}
                {botStatus === 'waiting_for_user' && (isListening ? '🎙️ Listening to You...' : 'Your Turn to Answer')}
                {botStatus === 'analyzing' && '⚡ Evaluating LTIMindtree Rubrics...'}
              </span>
            </div>
          </div>

          {/* Soundwave animation */}
          <div className={`audio-waveform ${botStatus === 'speaking' || isListening ? 'active' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* Interviewer Identity */}
          <div className="interviewer-info">
            <h3 className="interviewer-name">LTIMindtree Technical Panel</h3>
            <p className="interviewer-role">Assessing: {session.role.title}</p>
          </div>

          {/* Audio Controls */}
          <div className="speech-controls-row">
            <button 
              type="button" 
              className="replay-speech-btn"
              onClick={handleReplayQuestion}
              title="Click to have AI read the question again"
            >
              <Volume2 size={16} /> Replay Question Aloud
            </button>
            <button 
              type="button" 
              className={`mute-btn ${isMuted ? 'muted' : ''}`}
              onClick={onToggleMute}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Muted' : 'Voice On'}
            </button>
          </div>

          {/* Focus topic tag */}
          {currentQuestion?.focusTopic && (
            <div className="focus-topic-box">
              <span className="topic-title">Evaluated Competency:</span>
              <p className="topic-text">{currentQuestion.focusTopic}</p>
            </div>
          )}
        </div>

        {/* Right Column: Question Display & Dual Response Options (Voice & Text) */}
        <div className="question-answer-panel">
          {/* Active Question Box */}
          <div className="active-question-card">
            <div className="question-header">
              <span className="question-tag">
                <Sparkles size={14} />
                LTIMindtree Fresher Query
              </span>
              <button 
                type="button" 
                className="hint-toggle-btn"
                onClick={() => setShowHint(!showHint)}
              >
                <HelpCircle size={15} />
                {showHint ? 'Hide Guidance' : 'Request Hint'}
              </button>
            </div>

            <h2 className="question-text">{currentQuestion?.question}</h2>

            {/* Hint Dropdown */}
            {showHint && currentQuestion?.hint && (
              <div className="hint-callout">
                <div className="hint-callout-header">
                  <Sparkles size={16} className="hint-icon" />
                  <strong>LTIMindtree Panel Guidance:</strong>
                </div>
                <p>{currentQuestion.hint}</p>
              </div>
            )}
          </div>

          {/* Candidate Answering Workspace */}
          <div className="answer-workspace-card">
            {/* Input Mode Selector: Voice Preferred with Text Alternative */}
            <div className="mode-selector-tabs">
              <button 
                type="button"
                className={`mode-tab ${inputMode === 'voice' ? 'active' : ''}`}
                onClick={() => setInputMode('voice')}
              >
                <Mic size={16} />
                <span>Voice Answer (Recommended)</span>
                <span className="tab-pill">LTIMindtree Standard</span>
              </button>
              <button 
                type="button"
                className={`mode-tab ${inputMode === 'text' ? 'active' : ''}`}
                onClick={() => setInputMode('text')}
              >
                <Keyboard size={16} />
                <span>Text Alternative</span>
              </button>
            </div>

            {speechError && (
              <div className="speech-error-alert">
                <AlertCircle size={16} />
                <span>{speechError}</span>
              </div>
            )}

            {/* VOICE MODE WORKSPACE (Primary) */}
            {inputMode === 'voice' && (
              <div className="voice-workspace-view">
                <div className="voice-interaction-center">
                  <div className="voice-cta-banner">
                    <strong>Speak Your Answer Aloud</strong>
                    <p>LTIMindtree evaluates spoken fluency, structured logic, and technical depth.</p>
                  </div>

                  {/* Big Voice Button */}
                  <button 
                    type="button"
                    className={`big-mic-button ${isListening ? 'listening' : ''}`}
                    onClick={handleToggleVoice}
                    aria-label="Toggle voice recording"
                  >
                    <div className="mic-rings"></div>
                    {isListening ? <MicOff size={36} /> : <Mic size={36} />}
                    <span className="big-mic-label">
                      {isListening ? 'Listening... Tap to Stop' : 'Tap to Start Speaking'}
                    </span>
                  </button>

                  {/* Live Real-time Spoken Transcript Box */}
                  <div className="live-transcript-box">
                    <div className="transcript-box-header">
                      <span className="t-status-label">
                        {isListening ? (
                          <>
                            <span className="live-pulsing-dot"></span>
                            Live Speech Transcription Active:
                          </>
                        ) : (
                          'Your Spoken Response Transcript:'
                        )}
                      </span>
                      {candidateText && (
                        <button 
                          type="button" 
                          className="clear-speech-btn"
                          onClick={() => { setCandidateText(''); setInterimSpeech(''); }}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="transcript-display-area">
                      {candidateText || interimSpeech ? (
                        <p className="speech-content-text">
                          {candidateText}
                          {interimSpeech && <span className="interim-text"> {interimSpeech}</span>}
                        </p>
                      ) : (
                        <p className="speech-placeholder">
                          {isListening 
                            ? 'Listening to your microphone... Start explaining your answer clearly.' 
                            : 'Click "Tap to Start Speaking" above and speak your answer. Your speech will be transcribed in real time.'}
                        </p>
                      )}
                    </div>

                    {/* Word meter & Submit for Voice */}
                    <div className="voice-footer-row">
                      <div className="word-count-meter">
                        <span className={`count ${totalWords < 25 ? 'low' : totalWords > 220 ? 'high' : 'good'}`}>
                          {totalWords} words spoken
                        </span>
                        <span className="meter-label">
                          {totalWords < 25 ? '(Aim for at least 30-40 words)' : '(Solid depth)'}
                        </span>
                      </div>

                      <button 
                        type="button"
                        className="submit-answer-btn"
                        onClick={handleSubmitAnswer}
                        disabled={isSubmitting || !totalWords}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-sm"></span>
                            Evaluating Response...
                          </>
                        ) : (
                          <>
                            <span>Submit Spoken Answer</span>
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEXT MODE WORKSPACE (Alternative) */}
            {inputMode === 'text' && (
              <div className="text-workspace-view">
                <div className="textarea-container">
                  <textarea 
                    ref={textareaRef}
                    className="answer-textarea"
                    rows={6}
                    placeholder="Type your detailed answer here. Focus on technical terminology, your specific project contributions, and core CS fundamentals..."
                    value={candidateText}
                    onChange={(e) => setCandidateText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmitAnswer();
                      }
                    }}
                  />

                  <div className="textarea-footer">
                    <div className="word-count-meter">
                      <span className={`count ${totalWords < 25 ? 'low' : totalWords > 220 ? 'high' : 'good'}`}>
                        {totalWords} words
                      </span>
                      <span className="meter-label">
                        {totalWords < 25 ? '(Aim for 30-40 words for technical completeness)' : '(Well detailed)'}
                      </span>
                    </div>

                    <div className="submit-actions">
                      <button 
                        type="button" 
                        className="submit-answer-btn"
                        onClick={handleSubmitAnswer}
                        disabled={isSubmitting || !candidateText.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-sm"></span>
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <span>Submit Response</span>
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Answer Tips Bar */}
            <div className="answer-tips-bar">
              <span className="tip-badge">Fresher Tip</span>
              <p className="tip-text">
                For technical questions, always state the <strong>definition → real-world analogy → code/system trade-off</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Transcript History Drawer */}
      {session.conversation.length > 0 && (
        <div className="history-drawer-card">
          <button 
            type="button" 
            className="history-toggle-header"
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <div className="history-header-left">
              <MessageSquare size={18} />
              <span>Interview History & Panel Notes ({session.conversation.length} answered)</span>
            </div>
            {historyOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {historyOpen && (
            <div className="history-list">
              {session.conversation.map((turn, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-q">
                    <strong>Q{idx + 1}: {turn.title}</strong>
                    <p>{turn.question}</p>
                  </div>
                  <div className="history-a">
                    <strong>Your Response:</strong>
                    <p>{turn.candidateAnswer}</p>
                  </div>
                  {turn.critique && (
                    <div className="history-feedback-pill">
                      <span className="feedback-score">Score: {turn.critique.score}/100</span>
                      {turn.critique.interviewerReaction && (
                        <span className="feedback-reaction">"{turn.critique.interviewerReaction}"</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
