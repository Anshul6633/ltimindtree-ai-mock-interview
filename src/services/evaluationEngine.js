// Comprehensive LTIMindtree Fresher Evaluation & Development Area Analytics Engine

export function generateEvaluationReport(interviewSession) {
  const { conversation, candidate, role } = interviewSession;

  if (!conversation || conversation.length === 0) {
    return null;
  }

  // 1. Calculate scores per category
  const categoryScores = {
    coreCS: [],
    projectDefense: [],
    problemSolving: [],
    behavioral: []
  };

  conversation.forEach(entry => {
    const cat = entry.category || 'projectDefense';
    const score = entry.critique?.score || 70;
    if (categoryScores[cat]) {
      categoryScores[cat].push(score);
    }
  });

  const avg = (arr, fallback = 72) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;

  const scoreCoreCS = avg(categoryScores.coreCS, 74);
  const scoreProject = avg(categoryScores.projectDefense, 76);
  const scoreProblemSolving = avg(categoryScores.problemSolving, 72);
  const scoreBehavioral = avg(categoryScores.behavioral, 78);

  // Weighted overall readiness index
  const overallScore = Math.round(
    scoreCoreCS * 0.25 +
    scoreProject * 0.30 +
    scoreProblemSolving * 0.25 +
    scoreBehavioral * 0.20
  );

  // Verdict determination calibrated for LTIMindtree Freshers
  let verdict = '';
  let verdictBadge = '';
  let verdictSummary = '';

  if (overallScore >= 85) {
    verdict = 'LTIMindtree GET - Direct Select (Recommended)';
    verdictBadge = 'success';
    verdictSummary = 'Outstanding technical clarity, strong academic project ownership, and articulate communication. Ready to clear LTIMindtree fresher panels with distinction.';
  } else if (overallScore >= 70) {
    verdict = 'Strong Candidate (Minor Polish Needed)';
    verdictBadge = 'warning';
    verdictSummary = 'Solid grasp of core engineering principles and project workflow. Needs targeted practice on articulating database trade-offs, deadlock conditions, and STAR format results.';
  } else {
    verdict = 'Needs Preparation Before Placement Drive';
    verdictBadge = 'danger';
    verdictSummary = 'Basic understanding present, but responses lacked the technical depth, CS terminology, and concrete project defense expected in LTIMindtree recruitment interviews.';
  }

  // 2. Identify Detailed "Development Areas" (Weak Spots)
  const developmentAreas = [];

  conversation.forEach((turn, idx) => {
    const wordCount = turn.candidateAnswer.split(/\s+/).length;
    const isWeak = turn.critique?.score < 76 || wordCount < 22;

    if (isWeak || turn.critique?.developmentalAreas?.length > 0) {
      const primaryIssue = turn.critique?.developmentalAreas?.[0] || 'Needs deeper technical elaboration and real-world examples.';
      
      let benchmarkGuide = '';
      let recommendedAction = '';

      if (turn.stage === 'fresher_project_arch' || turn.stage === 'fresher_project_hurdle') {
        benchmarkGuide = 'LTIMindtree panels test whether you truly wrote the code or just joined a team: explain the 3-tier architecture, justify your database choice, and articulate 1 difficult bug you resolved using logs/debugging.';
        recommendedAction = 'Draw your project architecture diagram on paper, write down the schema for your 3 main tables/collections, and practice explaining your personal module.';
      } else if (turn.stage === 'fresher_core_oops_dbms') {
        benchmarkGuide = 'Explain the 4 OOP pillars using simple analogies (e.g., Encapsulation = medical capsule / private variables; Abstraction = car accelerator / abstract class). For ACID, illustrate Atomicity with a bank money transfer rollback.';
        recommendedAction = 'Master the difference between Abstract Class vs Interface, and memorize ACID transaction rollback with an SQL BEGIN TRANSACTION/ROLLBACK snippet.';
      } else if (turn.stage === 'fresher_os_networks_logic') {
        benchmarkGuide = 'State that threads share the same process memory while processes have independent address spaces. For duplicate detection, recommend a HashSet or HashMap for O(n) linear time rather than an O(n²) nested loop.';
        recommendedAction = 'Review Operating Systems Coffman Deadlock conditions (Mutual exclusion, Hold & wait, No preemption, Circular wait) and practice LeetCode "Contains Duplicate".';
      } else if (turn.stage === 'fresher_ltimindtree_culture') {
        benchmarkGuide = 'Demonstrate learning agility and enthusiastic willingness to learn new stacks. Explicitly confirm full flexibility for rotational shifts and Pan-India relocation (Bengaluru, Pune, Mumbai, Chennai, Hyderabad).';
        recommendedAction = 'Frame your answer around a 4-step learning plan (Documentation, small POC project, peer code review) and express high interest in LTIMindtree digital consulting.';
      } else {
        benchmarkGuide = 'Structure your answer with clarity: Academic background → Core technical skills → Relevant projects → Eagerness to join LTIMindtree.';
        recommendedAction = 'Practice a 90-second elevator pitch highlighting your degree, favorite programming language, and primary project.';
      }

      developmentAreas.push({
        id: `dev-${idx}`,
        questionTitle: turn.title,
        questionText: turn.question,
        candidateAnswerSnippet: turn.candidateAnswer.length > 130 
          ? turn.candidateAnswer.slice(0, 130) + '...' 
          : turn.candidateAnswer || '(No response recorded)',
        gapIdentified: primaryIssue,
        benchmarkGuide,
        recommendedAction,
        score: turn.critique?.score || 60
      });
    }
  });

  // Ensure high-value constructive areas are shown
  if (developmentAreas.length === 0) {
    developmentAreas.push({
      id: 'dev-adv-1',
      questionTitle: 'Advanced Database Indexing & B-Trees',
      questionText: 'DBMS Indexing Mechanisms',
      candidateAnswerSnippet: 'Solid overview provided.',
      gapIdentified: 'Can elevate answer by explaining Clustered vs Non-Clustered Indexes and B-Tree disk I/O tradeoffs.',
      benchmarkGuide: 'Explaining why we avoid indexing columns with high write frequency or low cardinality will impress senior technical interviewers.',
      recommendedAction: 'Study how B-Tree index lookup operates in O(log n) vs Full Table Scan in O(n).',
      score: 84
    });
  }

  // 3. Fresher 7-Day Targeted Revision Roadmap
  const revisionRoadmap = [
    {
      day: 'Day 1 & 2',
      focus: 'OOPs Pillars & DBMS ACID/Indexing',
      actionItems: [
        'Practice explaining Encapsulation vs Abstraction with real-world analogies',
        'Review ACID properties with a bank money transfer rollback scenario',
        'Study 1NF, 2NF, 3NF Normalization and Clustered vs Non-Clustered Indexes'
      ]
    },
    {
      day: 'Day 3 & 4',
      focus: 'Academic Project Deep-Dive & Architecture Defense',
      actionItems: [
        'Prepare a 2-minute whiteboard walkthrough of your project architecture',
        'Clarify your exact individual contribution versus teammates',
        'Identify 2 complex bugs you personally fixed and describe the debugging steps'
      ]
    },
    {
      day: 'Day 5',
      focus: 'OS Processes/Threads, Networks & Data Structures',
      actionItems: [
        'Review Process vs Thread memory model and the 4 Deadlock Coffman conditions',
        'Understand TCP 3-way handshake vs UDP and HTTP vs HTTPS (SSL/TLS)',
        'Practice O(1) HashSet duplicate detection and basic Array/String algorithms'
      ]
    },
    {
      day: 'Day 6 & 7',
      focus: 'LTIMindtree Cultural Fit & STAR Behavioral Practice',
      actionItems: [
        'Draft 2 STAR stories demonstrating adaptability and rapid learning of new tech stacks',
        'Prepare confirmation of shift flexibility and relocation to LTIMindtree delivery centers',
        'Retake this AI Mock Interview to verify score improvement'
      ]
    }
  ];

  return {
    candidateName: candidate.candidateName,
    roleTitle: role.title,
    interviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    overallScore,
    verdict,
    verdictBadge,
    verdictSummary,
    dimensionalScores: [
      { name: 'Core CS Fundamentals', score: scoreCoreCS, weight: '25%', desc: 'OOPs, DBMS, OS, Networks' },
      { name: 'Academic Project Defense', score: scoreProject, weight: '30%', desc: 'Architecture, module ownership, debugging' },
      { name: 'Coding & Algorithmic Logic', score: scoreProblemSolving, weight: '25%', desc: 'Data structures, time complexity, problem solving' },
      { name: 'STAR & LTIMindtree Culture', score: scoreBehavioral, weight: '20%', desc: 'Adaptability, shift/relocation flexibility' }
    ],
    developmentAreas,
    revisionRoadmap,
    transcript: conversation.map((c, i) => ({
      index: i + 1,
      title: c.title,
      question: c.question,
      answer: c.candidateAnswer,
      score: c.critique?.score || 70,
      strengths: c.critique?.strengths || [],
      areasToImprove: c.critique?.developmentalAreas || []
    }))
  };
}
