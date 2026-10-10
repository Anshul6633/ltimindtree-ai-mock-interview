import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, TrendingUp, AlertTriangle, CheckCircle, RotateCcw, 
  Printer, BookOpen, Layers, Star, ExternalLink, Calendar, 
  User, Check, ChevronDown, ChevronUp, Sparkles, Building2
} from 'lucide-react';

export default function ReportDashboard({ 
  reportData, 
  onRetake, 
  onNewResume 
}) {
  const [expandedDevId, setExpandedDevId] = useState(null);
  const [expandedTranscriptId, setExpandedTranscriptId] = useState(null);

  useEffect(() => {
    // Launch celebratory confetti when viewing the report
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }
  }, []);

  if (!reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const getBadgeClass = (badge) => {
    if (badge === 'success') return 'badge-success';
    if (badge === 'warning') return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="report-dashboard-container">
      {/* Top Banner with Print / Retake Actions */}
      <div className="report-action-header no-print">
        <div className="report-header-left">
          <div className="company-tag">
            <Building2 size={16} />
            <span>LTIMindtree Evaluation Report</span>
          </div>
          <span className="eval-date">Evaluated on {reportData.interviewDate}</span>
        </div>

        <div className="report-header-buttons">
          <button type="button" className="print-btn" onClick={handlePrint}>
            <Printer size={16} /> Print / Save as PDF
          </button>
          <button type="button" className="retake-btn" onClick={onRetake}>
            <RotateCcw size={16} /> Retake Mock Interview
          </button>
          <button type="button" className="new-resume-btn" onClick={onNewResume}>
            Upload Another Resume
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="report-hero-card">
        <div className="hero-left-meta">
          <div className="candidate-badge-row">
            <User size={18} />
            <span className="candidate-name">{reportData.candidateName}</span>
            <span className="divider-bullet">•</span>
            <span className="candidate-role-target">{reportData.roleTitle}</span>
          </div>
          <h1 className="report-title">Mock Interview Diagnostic Assessment</h1>
          <p className="verdict-summary-text">{reportData.verdictSummary}</p>
          <div className={`verdict-pill ${getBadgeClass(reportData.verdictBadge)}`}>
            {reportData.verdict}
          </div>
        </div>

        {/* Circular Overall Score Meter */}
        <div className="hero-score-meter">
          <div className="score-circle-wrapper">
            <svg viewBox="0 0 100 100" className="score-svg">
              <circle cx="50" cy="50" r="42" className="score-bg-circle" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                className="score-progress-circle"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * reportData.overallScore) / 100
                }}
              />
            </svg>
            <div className="score-circle-text">
              <span className="score-number">{reportData.overallScore}</span>
              <span className="score-max">/ 100</span>
            </div>
          </div>
          <span className="score-label">LTIMindtree Readiness Index</span>
        </div>
      </div>

      {/* 4-Dimensional Competency Breakdown */}
      <div className="competencies-grid">
        {reportData.dimensionalScores.map((dim, idx) => (
          <div key={idx} className="competency-card">
            <div className="comp-card-top">
              <span className="comp-name">{dim.name}</span>
              <span className="comp-score">{dim.score}%</span>
            </div>
            <div className="comp-progress-bar">
              <div 
                className="comp-progress-fill" 
                style={{ 
                  width: `${dim.score}%`,
                  backgroundColor: dim.score >= 80 ? '#10B981' : dim.score >= 65 ? '#6366F1' : '#F59E0B'
                }}
              ></div>
            </div>
            <div className="comp-footer">
              <span className="comp-desc">{dim.desc}</span>
              <span className="comp-weight">Weight: {dim.weight}</span>
            </div>
          </div>
        ))}
      </div>

      {/* KEY SECTION: Critical "Development Areas" (Weak Spots) */}
      <div className="report-section development-areas-section">
        <div className="section-header-row">
          <div className="section-title-group">
            <AlertTriangle className="section-icon warning" size={24} />
            <div>
              <h2 className="section-title">Critical Development Areas & Improvement Gaps</h2>
              <p className="section-subtitle">
                Targeted feedback highlighting technical gaps detected during your LTIMindtree interview defense.
              </p>
            </div>
          </div>
          <span className="dev-count-tag">{reportData.developmentAreas.length} Areas Identified</span>
        </div>

        <div className="development-cards-list">
          {reportData.developmentAreas.map((area, idx) => {
            const isExpanded = expandedDevId === area.id || expandedDevId === null;
            return (
              <div key={area.id || idx} className="dev-area-card">
                <div 
                  className="dev-card-header"
                  onClick={() => setExpandedDevId(expandedDevId === area.id ? null : area.id)}
                >
                  <div className="dev-header-left">
                    <span className="dev-index-badge">Area #{idx + 1}</span>
                    <h3 className="dev-title">{area.questionTitle}</h3>
                    <span className="dev-score-pill">Turn Score: {area.score}%</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {isExpanded && (
                  <div className="dev-card-body">
                    {/* The Prompt Asked */}
                    <div className="dev-sub-block">
                      <span className="sub-label">Question Asked:</span>
                      <p className="sub-text italic">"{area.questionText}"</p>
                    </div>

                    {/* Candidate's Answer Snippet */}
                    <div className="dev-sub-block candidate-snippet-box">
                      <span className="sub-label">Your Response Snippet:</span>
                      <p className="sub-text">"{area.candidateAnswerSnippet}"</p>
                    </div>

                    {/* Deficiency Analysis */}
                    <div className="dev-grid-two-col">
                      <div className="gap-analysis-box">
                        <span className="box-badge-tag gap">Identified Deficiency</span>
                        <p>{area.gapIdentified}</p>
                      </div>

                      <div className="benchmark-box">
                        <span className="box-badge-tag benchmark">LTIMindtree Panel Expectation</span>
                        <p>{area.benchmarkGuide}</p>
                      </div>
                    </div>

                    {/* Actionable Step */}
                    <div className="action-recommendation-box">
                      <div className="action-title-row">
                        <CheckCircle size={16} className="action-icon" />
                        <strong>Actionable Preparation Step:</strong>
                      </div>
                      <p>{area.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Targeted Study Roadmap */}
      <div className="report-section roadmap-section">
        <div className="section-header-row">
          <div className="section-title-group">
            <BookOpen className="section-icon accent" size={24} />
            <div>
              <h2 className="section-title">Personalized 7-Day LTIMindtree Revision Roadmap</h2>
              <p className="section-subtitle">
                Follow this focused plan to eliminate the identified gaps before your real interview.
              </p>
            </div>
          </div>
        </div>

        <div className="roadmap-grid">
          {reportData.revisionRoadmap.map((item, idx) => (
            <div key={idx} className="roadmap-day-card">
              <div className="roadmap-day-header">
                <span className="roadmap-day-tag">{item.day}</span>
                <h4 className="roadmap-focus-title">{item.focus}</h4>
              </div>
              <ul className="roadmap-checklist">
                {item.actionItems.map((act, aIdx) => (
                  <li key={aIdx}>
                    <Check size={14} className="check-icon" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Full Transcript Review */}
      <div className="report-section transcript-section">
        <div className="section-header-row">
          <div className="section-title-group">
            <Layers className="section-icon" size={24} />
            <div>
              <h2 className="section-title">Complete Question-by-Question Transcript & Feedback</h2>
              <p className="section-subtitle">
                Review the exact exchanges and panel ratings for each round of your mock interview.
              </p>
            </div>
          </div>
        </div>

        <div className="transcript-accordion">
          {reportData.transcript.map((item) => {
            const isOpen = expandedTranscriptId === item.index;
            return (
              <div key={item.index} className="transcript-item-card">
                <div 
                  className="transcript-header"
                  onClick={() => setExpandedTranscriptId(isOpen ? null : item.index)}
                >
                  <div className="transcript-header-left">
                    <span className="q-number">Q{item.index}</span>
                    <span className="q-title">{item.title}</span>
                  </div>

                  <div className="transcript-header-right">
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= Math.round(item.score / 20) ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                    <span className="turn-score-text">{item.score}/100</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="transcript-body">
                    <div className="transcript-qa-box">
                      <div className="t-block question">
                        <strong>LTIMindtree Panelist:</strong>
                        <p>{item.question}</p>
                      </div>
                      <div className="t-block answer">
                        <strong>Candidate Response:</strong>
                        <p>{item.answer || '(No response recorded)'}</p>
                      </div>
                    </div>

                    <div className="t-feedback-columns">
                      {item.strengths?.length > 0 && (
                        <div className="t-strengths">
                          <span className="f-label green">Strengths Observed:</span>
                          <ul>
                            {item.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                          </ul>
                        </div>
                      )}

                      {item.areasToImprove?.length > 0 && (
                        <div className="t-improve">
                          <span className="f-label orange">Areas for Improvement:</span>
                          <ul>
                            {item.areasToImprove.map((a, aIdx) => <li key={aIdx}>{a}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
