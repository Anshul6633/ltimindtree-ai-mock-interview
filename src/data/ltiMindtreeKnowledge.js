// LTIMindtree Knowledge Base, Fresher Competencies, and Portal Hiring Patterns

export const LTI_ROLES = [
  {
    id: 'fresher_cs_it',
    title: 'Graduate Engineer Trainee (GET) - CS & IT',
    category: 'LTIMindtree Campus / Off-Campus Hiring',
    subtext: 'B.Tech/B.E. (CS, IT) / MCA Freshers',
    focus: 'Academic Projects, Core CS (OOPs, DBMS, OS, Networks), Coding Logic & Problem Solving, Communication',
    defaultQuestionsCount: 6,
    badgeColor: '#06B6D4',
    isRecommended: true
  },
  {
    id: 'fresher_fullstack',
    title: 'Associate Software Engineer - Web & Full Stack',
    category: 'Fresher Trainee Developer Track',
    subtext: 'Freshers with Web Dev & Project Exposure',
    focus: 'React / JavaScript, Java Spring Boot or Node.js, REST APIs, SQL/NoSQL Databases, Git & Agile',
    defaultQuestionsCount: 6,
    badgeColor: '#6366F1',
    isRecommended: false
  },
  {
    id: 'fresher_circuit_transition',
    title: 'Graduate Engineer Trainee - Circuit to Software',
    category: 'ECE, EEE, Mechanical to Tech Transition',
    subtext: 'Circuit Branches Transitioning to IT',
    focus: 'Programming Fundamentals (C++/Java/Python), Basic Data Structures, Logic, Willingness to Learn',
    defaultQuestionsCount: 6,
    badgeColor: '#10B981',
    isRecommended: false
  }
];

export const SAMPLE_RESUMES = [
  {
    id: 'fresher_cs_aarav',
    name: 'Aarav Gupta',
    role: 'fresher_cs_it',
    title: 'B.Tech Computer Science & Engineering (2024 Graduate)',
    summary: 'Dedicated Computer Science graduate with strong fundamentals in Java, Object-Oriented Programming, DBMS, and Data Structures. Developed a full-stack student portal and seeking to launch career at LTIMindtree as a Graduate Engineer Trainee.',
    skills: ['Java (Core & Advanced)', 'Object-Oriented Programming (OOPs)', 'SQL (MySQL)', 'DBMS (ACID, Normalization)', 'Data Structures & Algorithms', 'HTML5/CSS3', 'JavaScript', 'Spring Boot (Basics)', 'Git'],
    education: 'B.Tech in Computer Science and Engineering - CGPA: 8.7/10 (2020 - 2024)',
    projects: [
      {
        title: 'Smart Campus Event & Ticketing Portal',
        tech: ['Java', 'Spring Boot', 'MySQL', 'React', 'JWT'],
        description: 'Final Year Major Project: Designed and deployed a web portal for university club events and ticket issuance. Integrated role-based authentication and managed ACID transactions for event booking.',
        potentialDrillAreas: [
          'ACID transaction isolation in ticket booking to prevent double-booking',
          'JWT authentication flow and token storage security',
          'Database indexing on event date and user ID columns',
          'Spring Boot Dependency Injection and MVC architecture'
        ]
      },
      {
        title: 'Student Grade & Attendance Management System',
        tech: ['Java', 'JDBC', 'MySQL'],
        description: 'Third Year Mini Project: Built a desktop application with CRUD operations, reporting dashboards, and relational schema for 1,200+ student records.',
        potentialDrillAreas: [
          'Difference between Statement and PreparedStatement in JDBC (SQL Injection prevention)',
          'Relational database normalization up to 3NF',
          'Exception handling hierarchy in Java'
        ]
      }
    ],
    experience: 'Academic Project Lead (Final Year) - Coordinated 4-member student team and led backend API development and MySQL schema design.'
  },
  {
    id: 'fresher_it_pooja',
    name: 'Pooja Iyer',
    role: 'fresher_fullstack',
    title: 'B.E. Information Technology (2024 Batch)',
    summary: 'Enthusiastic IT graduate with hands-on experience in MERN stack development, RESTful APIs, and responsive design. Passionate about cloud technologies and building enterprise solutions for LTIMindtree clients.',
    skills: ['JavaScript (ES6+)', 'React.js', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'RESTful APIs', 'Postman'],
    education: 'B.E. Information Technology - CGPA: 8.4/10 (2020 - 2024)',
    projects: [
      {
        title: 'Automated Placement & Job Tracking Portal',
        tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
        description: 'Final Year Project: Built a web portal connecting students with campus recruitment drives. Enabled resume uploads, interview scheduling, and automated status notifications.',
        potentialDrillAreas: [
          'MongoDB document schema vs Relational SQL schema tradeoffs',
          'State management and useEffect lifecycle in React',
          'RESTful API error handling and status code conventions',
          'Handling file upload streams in Node.js'
        ]
      }
    ],
    experience: 'Summer Web Development Intern at EduTech Solutions (2 Months) - Built responsive frontend components in React and tested backend endpoints using Postman.'
  },
  {
    id: 'fresher_circuit_rohan',
    name: 'Rohan Deshmukh',
    role: 'fresher_circuit_transition',
    title: 'B.Tech Electronics & Telecommunication (2024 Graduate)',
    summary: 'Electronics & Telecommunication graduate with strong analytical reasoning, C++ and Python programming skills, and a strong drive to build a career in software development and digital transformation at LTIMindtree.',
    skills: ['C++', 'Python', 'Basic Data Structures (Arrays, Linked Lists, Stacks)', 'SQL Basics', 'Computer Networks Basics', 'Git', 'Problem Solving'],
    education: 'B.Tech in Electronics & Telecommunication Engineering - CGPA: 8.1/10 (2020 - 2024)',
    projects: [
      {
        title: 'IoT-Based Energy Monitoring System with Python Analytics',
        tech: ['Python', 'MQTT Protocol', 'SQLite', 'C++'],
        description: 'Engineered an automated energy tracker logging power consumption to a local database and calculating daily peak usage patterns via Python scripts.',
        potentialDrillAreas: [
          'Data structures used for caching sensor values in memory',
          'TCP vs UDP protocols in network transmission',
          'Object-oriented principles applied in C++ driver modules'
        ]
      }
    ],
    experience: 'Self-Directed Learner: Completed LeetCode 150+ problems in C++ and earned HackerRank Problem Solving & SQL Badges.'
  }
];

export const LTI_COMPETENCIES = {
  coreCS: {
    name: 'Core Computer Science Fundamentals',
    weight: 0.25,
    topics: ['OOP Pillars (Polymorphism, Abstraction)', 'DBMS (ACID, Normalization, Indexing)', 'OS (Process vs Thread, Deadlock)', 'Computer Networks (TCP/IP, HTTP/S)']
  },
  projectDefense: {
    name: 'Academic Final Year Project Defense',
    weight: 0.30,
    topics: ['Architecture & Tech Stack Choice', 'Individual Contribution vs Team Work', 'Database Design & Rationale', 'Debugging & Technical Hurdles']
  },
  problemSolving: {
    name: 'Coding Logic & Algorithmic Thinking',
    weight: 0.25,
    topics: ['Data Structures (Arrays, Strings, HashMaps)', 'Time & Space Complexity (Big-O)', 'Diagnostic Debugging Workflow', 'Clean Code Practices']
  },
  behavioral: {
    name: 'LTIMindtree Cultural Fit & Communication',
    weight: 0.20,
    topics: ['STAR Method (Situation, Task, Action, Result)', 'Learning Agility (New Stacks)', 'Team Conflict Resolution', 'Shift / Relocation Flexibility']
  }
};

export const FRESHER_INTERVIEW_BLUEPRINT = [
  {
    step: 1,
    stage: 'fresher_intro',
    category: 'behavioral',
    title: 'Personal Introduction & Academic Background',
    template: (candidate, role) => 
      `Welcome ${candidate.candidateName || 'there'}! I am your technical interviewer for LTIMindtree's Graduate Engineer Trainee (GET) panel. To start our conversation, could you please introduce yourself, share a brief overview of your academic background in ${candidate.education || 'engineering'}, and tell me what initially sparked your passion for software engineering?`,
    focusTopic: 'Self-Introduction, Spoken Fluency, Academic Journey, Career Motivation',
    hint: 'Briefly mention: Your degree, college, key technical areas you enjoy (e.g. Java, OOPs, SQL), and your motivation to build enterprise systems.'
  },
  {
    step: 2,
    stage: 'fresher_project_arch',
    category: 'projectDefense',
    title: 'Final Year / Academic Project Deep-Dive',
    template: (candidate, project) => 
      `In your resume, you have highlighted your project "${project.title}". Could you walk me through the high-level architecture of this application? Specifically, why did your team select ${project.tech?.join(', ') || 'this tech stack'}, and what was your exact personal contribution versus other team members?`,
    focusTopic: 'Architecture & Personal Module Ownership in Academic Project',
    hint: 'Explain: 1) What the project does, 2) The architecture (Frontend, Backend, Database), 3) The exact module YOU coded, and 4) Why you chose this technology over alternatives.'
  },
  {
    step: 3,
    stage: 'fresher_project_hurdle',
    category: 'projectDefense',
    title: 'Project Technical Hurdle & Debugging',
    template: (candidate, project) => 
      `While developing "${project.title}", what was the most difficult bug, performance bottleneck, or edge-case you personally encountered? How did you systematically debug it, and how did you verify that the solution worked?`,
    focusTopic: 'Real Debugging Methodology, Root Cause Analysis, STAR Problem Resolution',
    hint: 'Describe a real issue (e.g., database constraint failure, CORS error, authentication expiration, or null pointer exception), how you diagnosed it with logs or debugging tools, and the final fix.'
  },
  {
    step: 4,
    stage: 'fresher_core_oops_dbms',
    category: 'coreCS',
    title: 'Core CS: OOPs Pillars & DBMS Fundamentals',
    template: (candidate) => 
      `At LTIMindtree, solid computer science fundamentals are essential for our engineering teams. Can you explain the 4 pillars of Object-Oriented Programming (OOP) with real-world analogies? Following that, what are ACID properties in DBMS, and could you explain how Atomicity and Durability work in a bank money transfer scenario?`,
    focusTopic: 'OOP 4 Pillars (Abstraction, Encapsulation, Inheritance, Polymorphism) & DBMS ACID Properties',
    hint: 'Define Encapsulation (data hiding) vs Abstraction (interface simplicity). For ACID, explain that in a bank transfer of ₹5,000 from Account A to B, if debit succeeds but credit fails, Atomicity rolls it back completely!'
  },
  {
    step: 5,
    stage: 'fresher_os_networks_logic',
    category: 'problemSolving',
    title: 'OS Concepts, Networks & Algorithmic Logic',
    template: (candidate) => 
      `Two quick fundamental questions: First, what is the primary architectural difference between a Process and a Thread in an Operating System, and what is a Deadlock? Second, if you need to detect duplicate elements in an array of 100,000 numbers, which data structure would you choose to achieve optimal O(n) time complexity, and why?`,
    focusTopic: 'Process vs Thread Memory, Deadlock Conditions, HashMap / HashSet O(1) Lookup Efficiency',
    hint: 'A process has its own isolated memory; threads share memory within the same process. Deadlock is circular waiting for resources. For duplicates, a HashSet or HashMap provides O(1) average lookup and O(n) total time complexity.'
  },
  {
    step: 6,
    stage: 'fresher_ltimindtree_culture',
    category: 'behavioral',
    title: 'LTIMindtree Cultural Fit & Learning Agility',
    template: (candidate) => 
      `At LTIMindtree, you will be deployed to high-impact projects serving international clients across North America, Europe, and Asia. If you are assigned to a client project that requires working with an entirely new programming language or framework on short notice, or if you need to adapt to rotational shifts and relocate to our development centers (e.g., Bengaluru, Pune, Mumbai, or Chennai), how do you approach this opportunity?`,
    focusTopic: 'Learning Agility, Flexibility (Shifts & Relocation), Client Delivery Mindset, Why LTIMindtree',
    hint: 'Demonstrate adaptability and excitement for continuous learning. Emphasize that you view learning new stacks as career growth, and confirm complete flexibility regarding shifts and relocation.'
  }
];

