import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, Plus, X, 
  Sparkles, ArrowRight, User, Briefcase, Award, Cpu, 
  HelpCircle, Layers, Flame, GraduationCap, Mic
} from 'lucide-react';
import { LTI_ROLES, SAMPLE_RESUMES } from '../data/ltiMindtreeKnowledge.js';
import { extractTextFromFile, parseResumeContent } from '../data/resumeParser.js';

export default function ResumeSetup({ onStartInterview }) {
  const [selectedRoleId, setSelectedRoleId] = useState('fresher_cs_it');
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [pasteTextMode, setPasteTextMode] = useState(false);
  const [pastedRawText, setPastedRawText] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const selectedRole = LTI_ROLES.find(r => r.id === selectedRoleId) || LTI_ROLES[0];

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsParsing(true);
    try {
      const text = await extractTextFromFile(file);
      const parsed = parseResumeContent(text);
      setCandidateProfile(parsed);
    } catch (err) {
      console.error('Error parsing file:', err);
      alert('Could not parse resume automatically. Please paste the resume text directly.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedRoleId(sample.role);
    setCandidateProfile({
      candidateName: sample.name,
      skills: [...sample.skills],
      projects: JSON.parse(JSON.stringify(sample.projects)),
      education: sample.education,
      rawText: sample.summary
    });
  };

  const handleParsePastedText = () => {
    if (!pastedRawText.trim()) return;
    setIsParsing(true);
    const parsed = parseResumeContent(pastedRawText);
    setCandidateProfile(parsed);
    setIsParsing(false);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !candidateProfile) return;
    if (!candidateProfile.skills.includes(newSkillInput.trim())) {
      setCandidateProfile({
        ...candidateProfile,
        skills: [...candidateProfile.skills, newSkillInput.trim()]
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCandidateProfile({
      ...candidateProfile,
      skills: candidateProfile.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleStart = () => {
    if (!candidateProfile) {
      alert('Please upload a resume, paste content, or pick a sample profile.');
      return;
    }
    onStartInterview(candidateProfile, selectedRole);
  };

  return (
    <div className="resume-setup-container">
      {/* Hero Header */}
      <div className="hero-banner">
        <div className="hero-badge">
          <GraduationCap size={16} />
          <span>LTIMindtree Fresher Recruitment Portal • Campus & Off-Campus Hiring</span>
        </div>
        <h1 className="hero-title">
          LTIMindtree <span className="highlight-gradient">AI Mock Interview</span> System
        </h1>
        <p className="hero-description">
          Calibrated strictly to LTIMindtree's official fresher interview process. 
          Upload your resume, listen as the AI reads questions aloud, respond with <strong>Voice (Speech-to-Text)</strong> or <strong>Text</strong>, 
          and receive an in-depth <strong>Development Area Diagnostic</strong> to guarantee interview selection.
        </p>
      </div>

      {/* Step 1: Select Fresher Role Track */}
      <div className="setup-card">
        <div className="card-header-row">
          <div className="step-number">1</div>
          <div>
            <h2 className="card-heading">Select Fresher Engineering Stream</h2>
            <p className="card-subheading">Calibrates the CS fundamentals, coding rigor, and project evaluation depth.</p>
          </div>
        </div>

        <div className="roles-grid">
          {LTI_ROLES.map(role => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div 
                key={role.id}
                className={`role-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <div className="role-option-top">
                  <span className="role-category-tag">{role.category}</span>
                  {isSelected && <CheckCircle2 size={18} className="selected-icon" />}
                </div>
                <h3 className="role-title">{role.title}</h3>
                <span className="role-subtext">{role.subtext}</span>
                <p className="role-focus">{role.focus}</p>
                <div className="role-footer">
                  <span className="question-count-badge">{role.defaultQuestionsCount} Questions</span>
                  <span className="duration-tag">~15 Mins</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Resume Ingestion */}
      <div className="setup-card">
        <div className="card-header-row">
          <div className="step-number">2</div>
          <div>
            <h2 className="card-heading">Upload Fresher Resume or Select Sample</h2>
            <p className="card-subheading">
              Our AI extracts your academic major project, languages, and core subjects to dynamically personalize each question.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="quick-sample-section">
          <span className="sample-label">
            <Flame size={16} className="sample-icon" />
            1-Click Fresher Profiles:
          </span>
          <div className="sample-buttons">
            {SAMPLE_RESUMES.map(sample => (
              <button 
                key={sample.id}
                type="button"
                className="sample-btn"
                onClick={() => handleSelectSample(sample)}
              >
                <strong>{sample.name}</strong> • {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Box or Paste Mode */}
        {!pasteTextMode ? (
          <div 
            className={`dropzone-box ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud size={48} className="dropzone-icon" />
            <h4 className="dropzone-title">Upload your resume file</h4>
            <p className="dropzone-sub">Supports PDF, DOCX, or plain TXT (Runs 100% locally in your browser)</p>
            
            <label className="browse-file-btn">
              Browse Resume File
              <input 
                type="file" 
                accept=".pdf,.txt,.docx" 
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>

            <button 
              type="button" 
              className="text-toggle-btn"
              onClick={() => setPasteTextMode(true)}
            >
              Or click here to paste resume text directly
            </button>
          </div>
        ) : (
          <div className="paste-text-box">
            <div className="paste-header">
              <label htmlFor="resume-textarea">Paste Resume Text / Project Details:</label>
              <button 
                type="button" 
                className="text-toggle-btn"
                onClick={() => setPasteTextMode(false)}
              >
                Switch back to file upload
              </button>
            </div>
            <textarea 
              id="resume-textarea"
              className="resume-textarea"
              rows={6}
              placeholder="Paste your education, skills, and academic project descriptions here..."
              value={pastedRawText}
              onChange={(e) => setPastedRawText(e.target.value)}
            />
            <button 
              type="button"
              className="btn-accent"
              onClick={handleParsePastedText}
              disabled={isParsing || !pastedRawText.trim()}
            >
              {isParsing ? 'Analyzing Resume...' : 'Parse & Extract Profile'}
            </button>
          </div>
        )}

        {isParsing && (
          <div className="parsing-indicator">
            <div className="spinner"></div>
            <span>Analyzing projects, technical skills, and drill-down targets...</span>
          </div>
        )}
      </div>

      {/* Step 3: Extracted Profile & Customizer (If profile loaded) */}
      {candidateProfile && (
        <div className="setup-card profile-preview-card">
          <div className="card-header-row">
            <div className="step-number success">✓</div>
            <div className="profile-header-meta">
              <h2 className="card-heading">Extracted Candidate Profile</h2>
              <span className="profile-ready-tag">Ready for Interview</span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-field-group">
              <label>Candidate Name:</label>
              <input 
                type="text" 
                className="profile-input"
                value={candidateProfile.candidateName}
                onChange={(e) => setCandidateProfile({ ...candidateProfile, candidateName: e.target.value })}
              />
            </div>
            <div className="profile-field-group">
              <label>Education / Engineering Degree:</label>
              <input 
                type="text" 
                className="profile-input"
                value={candidateProfile.education}
                onChange={(e) => setCandidateProfile({ ...candidateProfile, education: e.target.value })}
              />
            </div>
          </div>

          {/* Skills tags */}
          <div className="profile-skills-section">
            <label>Detected Skills (Panel will test these):</label>
            <div className="skills-chip-list">
              {candidateProfile.skills.map(skill => (
                <span key={skill} className="skill-chip">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            <div className="add-skill-row">
              <input 
                type="text" 
                placeholder="Add another skill (e.g. C++, Java, SQL)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="add-skill-input"
              />
              <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Academic Projects */}
          <div className="profile-projects-section">
            <label>Academic Projects for Technical Defense:</label>
            <div className="projects-grid">
              {candidateProfile.projects.map((proj, idx) => (
                <div key={idx} className="project-card">
                  <div className="project-card-header">
                    <span className="proj-idx">Project #{idx + 1}</span>
                    <h4 className="proj-title">{proj.title}</h4>
                  </div>
                  <div className="proj-tech-list">
                    {proj.tech?.map(t => (
                      <span key={t} className="tech-badge">{t}</span>
                    ))}
                  </div>
                  <p className="proj-desc">{proj.description}</p>
                  {proj.potentialDrillAreas?.length > 0 && (
                    <div className="drill-areas-box">
                      <span className="drill-label">Targeted Drill-Down Areas:</span>
                      <ul>
                        {proj.potentialDrillAreas.map((area, aIdx) => (
                          <li key={aIdx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <div className="launch-section">
            <div className="launch-info">
              <Award size={22} className="launch-icon" />
              <div>
                <strong>LTIMindtree Fresher Panel Ready</strong>
                <p>AI will speak questions aloud. Answer with Voice (Microphone) or Text.</p>
              </div>
            </div>
            <button 
              type="button" 
              className="launch-interview-btn"
              onClick={handleStart}
            >
              <span>Launch Mock Interview</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
