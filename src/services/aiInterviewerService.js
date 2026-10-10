// AI Interviewer Orchestration calibrated for LTIMindtree Fresher Recruitment

import { FRESHER_INTERVIEW_BLUEPRINT, LTI_COMPETENCIES } from '../data/ltiMindtreeKnowledge.js';

export class AIInterviewerSession {
  constructor(candidateProfile, roleConfig, customApiKey = '') {
    this.candidate = candidateProfile;
    this.role = roleConfig;
    this.apiKey = customApiKey ? customApiKey.trim() : '';
    this.conversation = [];
    this.currentQuestionIndex = 0;
    this.totalQuestions = 6;
    this.interviewPlan = this.generateFresherInterviewPlan();
  }

  generateFresherInterviewPlan() {
    const primaryProject = this.candidate.projects && this.candidate.projects[0] 
      ? this.candidate.projects[0] 
      : { 
          title: 'Academic Web & Database Project', 
          tech: ['Java', 'SQL', 'HTML/CSS'], 
          potentialDrillAreas: ['Database transactions and indexing', 'Authentication security'] 
        };

    return FRESHER_INTERVIEW_BLUEPRINT.map(step => {
      let qText = '';
      if (step.stage === 'fresher_intro') {
        qText = step.template(this.candidate, this.role);
      } else if (step.stage === 'fresher_project_arch' || step.stage === 'fresher_project_hurdle') {
        qText = step.template(this.candidate, primaryProject);
      } else {
        qText = step.template(this.candidate);
      }

      return {
        stage: step.stage,
        category: step.category,
        title: step.title,
        question: qText,
        focusTopic: step.focusTopic,
        projectRef: primaryProject,
        hint: step.hint
      };
    });
  }

  getCurrentQuestion() {
    if (this.currentQuestionIndex < this.interviewPlan.length) {
      return this.interviewPlan[this.currentQuestionIndex];
    }
    return null;
  }

  async submitCandidateAnswer(candidateText) {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return { isFinished: true };

    const entry = {
      questionIndex: this.currentQuestionIndex,
      category: currentQ.category,
      stage: currentQ.stage,
      title: currentQ.title,
      question: currentQ.question,
      candidateAnswer: candidateText.trim(),
      timestamp: new Date().toISOString()
    };

    // Analyze answer quality based on LTIMindtree Fresher criteria
    const critique = await this.evaluateAnswerTurn(currentQ, candidateText);
    entry.critique = critique;

    this.conversation.push(entry);
    this.currentQuestionIndex++;

    const isFinished = this.currentQuestionIndex >= this.interviewPlan.length;
    const nextQuestion = !isFinished ? this.getCurrentQuestion() : null;

    return {
      isFinished,
      critique,
      nextQuestion,
      interviewerReaction: critique.interviewerReaction
    };
  }

  async evaluateAnswerTurn(questionObj, answer) {
    const text = answer.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;

    // Optional direct Gemini API call
    if (this.apiKey) {
      try {
        const geminiResult = await this.callGeminiForTurn(questionObj, text);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local evaluator:', err);
      }
    }

    return this.evaluateFresherAnswer(questionObj, text, wordCount);
  }

  evaluateFresherAnswer(questionObj, text, wordCount) {
    let score = 70;
    const strengths = [];
    const developmentalAreas = [];
    let interviewerReaction = "Thank you for answering that question.";

    // 1. Length & Depth Analysis
    if (wordCount < 18) {
      score = Math.max(35, wordCount * 2.2);
      developmentalAreas.push("Answer was too brief. In LTIMindtree interviews, freshers must elaborate on technical details and provide examples.");
      interviewerReaction = "Thank you. In an engineering panel, speaking in more depth about your implementation and reasoning helps prove your capability.";
    } else {
      // 2. Technical Keyword Analysis tailored to question category
      let relevantKeywords = [];
      if (questionObj.category === 'coreCS') {
        relevantKeywords = ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'acid', 'atomicity', 'consistency', 'isolation', 'durability', 'index', 'table', 'rollback', 'commit', 'transaction'];
      } else if (questionObj.category === 'projectDefense') {
        relevantKeywords = ['architecture', 'database', 'frontend', 'backend', 'api', 'module', 'contribution', 'team', 'bug', 'debug', 'error', 'solution', 'test'];
      } else if (questionObj.category === 'problemSolving') {
        relevantKeywords = ['process', 'thread', 'memory', 'deadlock', 'hashmap', 'hashset', 'o(1)', 'o(n)', 'complexity', 'array', 'lookup'];
      } else {
        relevantKeywords = ['learning', 'adapt', 'flexible', 'relocate', 'shift', 'client', 'grow', 'ltimindtree', 'technology', 'challenge'];
      }

      const matchedKeywords = relevantKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(text));

      if (matchedKeywords.length >= 3) {
        score += 15;
        strengths.push(`Strong command of essential technical concepts (${matchedKeywords.slice(0, 3).join(', ')}).`);
      } else if (matchedKeywords.length === 1 || matchedKeywords.length === 2) {
        score += 5;
        strengths.push(`Mentioned core concept: ${matchedKeywords.join(', ')}.`);
        developmentalAreas.push(`Could integrate more specific terminology like ${relevantKeywords.slice(0, 3).join(', ')} to show complete mastery.`);
      } else {
        score -= 5;
        developmentalAreas.push("Lacked core technical keywords and specific definitions expected for this question.");
      }

      // 3. Question-specific checks
      if (questionObj.stage === 'fresher_core_oops_dbms') {
        if (!/atomicity|rollback/i.test(text)) {
          developmentalAreas.push("Did not clearly explain the banking rollback scenario for Atomicity.");
        }
        if (!/encapsulation|abstraction/i.test(text)) {
          developmentalAreas.push("Ensure you clearly contrast Encapsulation (data hiding) with Abstraction (interface simplicity).");
        }
      }

      if (questionObj.stage === 'fresher_os_networks_logic') {
        if (!/hashmap|hashset|o\(n\)|set/i.test(text)) {
          developmentalAreas.push("Did not mention using a HashSet or HashMap for O(n) duplicate detection.");
        }
        if (!/memory|share|address/i.test(text)) {
          developmentalAreas.push("Remember to highlight that threads share the process's memory space, while processes have separate address spaces.");
        }
      }

      if (questionObj.stage === 'fresher_ltimindtree_culture') {
        if (/relocat|shift|flexib/i.test(text)) {
          strengths.push("Expressed clear flexibility and enthusiasm for global client delivery.");
        } else {
          developmentalAreas.push("Explicitly confirm your flexibility for Pan-India relocation and rotational shifts when answering LTIMindtree HR/cultural questions.");
        }
      }

      if (wordCount >= 45 && wordCount <= 220) {
        score += 5;
        strengths.push("Well-structured response length with clear pacing.");
        interviewerReaction = "Excellent breakdown. I appreciate how clearly you articulated your response.";
      } else if (wordCount > 220) {
        developmentalAreas.push("Keep responses crisp and focused on the core technical points to prevent rambling.");
        interviewerReaction = "Understood. That was very thorough. Keeping it concise will make it even stronger.";
      }
    }

    score = Math.min(95, Math.max(30, Math.round(score)));

    return {
      score,
      strengths: strengths.length > 0 ? strengths : ['Understood the fundamental premise of the question.'],
      developmentalAreas: developmentalAreas.length > 0 ? developmentalAreas : ['Deepen real-world examples and quantitative impact.'],
      interviewerReaction
    };
  }

  async callGeminiForTurn(questionObj, text) {
    const prompt = `You are an LTIMindtree technical interviewer evaluating an engineering fresher for the role of ${this.role.title}.
Question: "${questionObj.question}"
Candidate Answer: "${text}"

Evaluate according to LTIMindtree fresher recruitment standards (CS accuracy, project ownership, communication).
Respond in pure JSON:
{
  "score": <number 30-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "developmentalAreas": ["<actionable weakness 1>", "<weakness 2>"],
  "interviewerReaction": "<1-2 sentence transition phrase to speak back to the student>"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(raw);
  }
}
