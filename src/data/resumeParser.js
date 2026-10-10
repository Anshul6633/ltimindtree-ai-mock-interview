// Resume Parsing and Entity Extraction Engine

const COMMON_SKILLS = [
  'Java', 'Python', 'C++', 'C', 'C#', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
  'React', 'React.js', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Flask',
  'SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis', 'Kafka',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'Linux',
  'OOP', 'OOPs', 'DBMS', 'Operating Systems', 'Data Structures', 'Algorithms', 'Computer Networks',
  'REST API', 'RESTful APIs', 'Microservices', 'GraphQL', 'Machine Learning', 'Pandas', 'NumPy',
  'TailwindCSS', 'Bootstrap', 'Agile', 'Scrum', 'Jira'
];

/**
 * Extracts plain text from a File object (handles .txt, .pdf, .docx or pasted content)
 */
export async function extractTextFromFile(file) {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return await file.text();
  }

  // If PDF, perform client-side extraction of stream text
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    return extractTextFromPdfBuffer(arrayBuffer);
  }

  // Fallback to text reading
  try {
    const text = await file.text();
    if (text && text.trim().length > 50) return text;
  } catch {
    // Ignore and proceed to binary fallback
  }

  // Binary stream text scan fallback
  const arrayBuffer = await file.arrayBuffer();
  return extractPrintableStringsFromBuffer(arrayBuffer);
}

/**
 * Basic PDF text stream parser without heavy external bundle dependencies
 */
function extractTextFromPdfBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  const len = Math.min(bytes.length, 500000); // 500KB cap
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }

  // Look for text operators in PDF streams: (Text) Tj or [(T)(e)(x)(t)] TJ
  const textChunks = [];
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(binaryString)) !== null) {
    const cleaned = match[1].replace(/\\([()\\])/g, '$1');
    if (cleaned.trim().length > 0) {
      textChunks.push(cleaned);
    }
  }

  // If regex found valid text chunks
  if (textChunks.length > 15) {
    return textChunks.join(' ').replace(/\s+/g, ' ');
  }

  // Fallback: extract continuous ASCII printable strings
  return extractPrintableStringsFromBuffer(buffer);
}

function extractPrintableStringsFromBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  const printableChars = [];
  let currentWord = '';

  for (let i = 0; i < bytes.length; i++) {
    const charCode = bytes[i];
    // Printable ASCII characters and newlines
    if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
      currentWord += String.fromCharCode(charCode);
    } else {
      if (currentWord.trim().length >= 3) {
        // filter out PDF internal bytecode tokens like /Type /Pages /Font
        if (!currentWord.startsWith('/') && !currentWord.includes('stream') && !currentWord.includes('endobj')) {
          printableChars.push(currentWord.trim());
        }
      }
      currentWord = '';
    }
  }

  const result = printableChars.join(' ').replace(/\s+/g, ' ');
  return result.length > 50 ? result : 'Uploaded resume text extracted. Please verify and refine your project details below.';
}

/**
 * Intelligent entity extractor that parses skills, projects, and education
 */
export function parseResumeContent(rawText) {
  const lines = rawText.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  const fullText = rawText;

  // 1. Detect candidate name (typically first 1-3 lines)
  let candidateName = 'Candidate';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (line.length > 2 && line.length < 35 && !line.includes('@') && !line.includes('http') && !/resume|curriculum|phone|email|profile/i.test(line)) {
      candidateName = line.replace(/[^a-zA-Z\s]/g, '').trim();
      if (candidateName.length > 2) break;
    }
  }
  if (!candidateName || candidateName === 'Candidate') {
    candidateName = 'LTIMindtree Aspirant';
  }

  // 2. Extract technical skills by matching against known dictionary
  const foundSkillsSet = new Set();
  COMMON_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(fullText)) {
      foundSkillsSet.add(skill);
    }
  });
  let skills = Array.from(foundSkillsSet);
  if (skills.length === 0) {
    skills = ['Java', 'SQL', 'Data Structures', 'OOPs', 'Problem Solving'];
  }

  // 3. Extract projects
  const projects = extractProjects(rawText, skills);

  // 4. Extract education
  let education = 'Bachelor of Engineering / Technology (Computer Science / IT)';
  const eduMatch = fullText.match(/(B\.?Tech|B\.?E|B\.?Sc|BCA|MCA|M\.?Tech)[\s\w,.-]{0,80}/i);
  if (eduMatch) {
    education = eduMatch[0].trim();
  }

  return {
    candidateName,
    skills,
    projects,
    education,
    rawText: rawText.slice(0, 3000)
  };
}

/**
 * Extracts project titles, technologies, and creates smart interview drill-down targets
 */
function extractProjects(text, availableSkills) {
  const projects = [];

  // Look for sections like "PROJECTS", "ACADEMIC PROJECTS"
  const projectRegex = /(?:PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS)([\s\S]*?)(?:EDUCATION|EXPERIENCE|CERTIFICATIONS|SKILLS|ACHIEVEMENTS|$)/i;
  const projectSectionMatch = text.match(projectRegex);
  const targetText = projectSectionMatch ? projectSectionMatch[1] : text;

  // Break by common delimiters or bullet points
  const candidateBlocks = targetText.split(/\n{2,}|\u2022|\u25CF|\* -/);

  for (const block of candidateBlocks) {
    const cleaned = block.trim();
    if (cleaned.length > 40 && cleaned.length < 800) {
      // Find title: usually the first sentence or before a colon/hyphen
      const firstLine = cleaned.split(/[\n.:]/)[0].trim();
      if (firstLine.length > 5 && firstLine.length < 60 && !/experience|education|skill|certif/i.test(firstLine)) {
        // Find technologies used in this block
        const projTech = availableSkills.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(cleaned));
        
        projects.push({
          title: firstLine,
          tech: projTech.length > 0 ? projTech : ['Java', 'SQL', 'REST API'],
          description: cleaned.slice(0, 250) + (cleaned.length > 250 ? '...' : ''),
          potentialDrillAreas: generateDrillAreas(firstLine, projTech, cleaned)
        });
      }
    }
    if (projects.length >= 3) break;
  }

  // If no projects parsed cleanly, provide a realistic default project based on extracted skills
  if (projects.length === 0) {
    const primarySkill = availableSkills[0] || 'Java';
    const secondarySkill = availableSkills[1] || 'SQL';
    projects.push({
      title: `${primarySkill}-Based Web Application & Portal`,
      tech: [primarySkill, secondarySkill, 'REST APIs', 'Git'],
      description: `Designed and built an interactive system utilizing ${primarySkill} and ${secondarySkill} with secure endpoints, modular design patterns, and responsive UI.`,
      potentialDrillAreas: [
        `Architecture & data flow of ${primarySkill} backend`,
        `Handling database queries and performance in ${secondarySkill}`,
        'Authentication and API security'
      ]
    });
  }

  return projects;
}

function generateDrillAreas(title, tech, desc) {
  const drills = [];
  if (tech.includes('React') || tech.includes('JavaScript') || tech.includes('TypeScript')) {
    drills.push('Component lifecycle, state management, and virtual DOM efficiency');
  }
  if (tech.includes('Spring Boot') || tech.includes('Java')) {
    drills.push('Spring IoC / Dependency Injection and multithreading safety');
  }
  if (tech.includes('Node.js') || tech.includes('Express')) {
    drills.push('Event loop architecture and asynchronous error propagation');
  }
  if (tech.includes('SQL') || tech.includes('MySQL') || tech.includes('PostgreSQL')) {
    drills.push('Query optimization, indexing strategies, and ACID transaction isolation');
  }
  if (tech.includes('MongoDB')) {
    drills.push('Document schema design tradeoffs versus relational normalization');
  }
  if (drills.length === 0) {
    drills.push('Scalability under high load', 'Edge-case validation & unit testing', 'Individual contribution vs pre-built templates');
  }
  return drills.slice(0, 3);
}
