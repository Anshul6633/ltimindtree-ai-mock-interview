# 🎯 LTIMindtree AI Mock Interview Platform

An enterprise-grade, voice-first AI Mock Interview Simulator specifically calibrated to the **LTIMindtree Fresher Recruitment Portal** (Graduate Engineer Trainee / Associate Software Engineer tracks).

Designed for zero-latency, high-concurrency campus placement drives, supporting **5,000+ concurrent candidates** on Vercel with pure client-side & edge execution.

---

## 🌟 Key Features

1. **Voice-First AI Interviewer (with Text Alternative)**:
   - **AI Question Vocalization**: The AI panel automatically speaks each question aloud with realistic cadence.
   - **Preferred Voice Input**: Large pulsing microphone interface with real-time continuous speech-to-text transcription.
   - **Seamless Text Mode**: Students can easily switch to typing or edit their transcribed answers before submitting.

2. **LTIMindtree Fresher Recruitment Pattern**:
   - Calibrated strictly to LTIMindtree campus & off-campus hiring blueprints:
     - **Personal Introduction & Academic Background**
     - **Final Year / Academic Project Deep-Dive** (Architecture, personal module, and debugging hurdles)
     - **Core CS Fundamentals** (4 OOP pillars with real-world analogies, DBMS ACID properties banking rollback, Normalization, Indexing)
     - **OS & Networks Logic** (Process vs Thread memory, Deadlocks, HashSet/HashMap $O(n)$ duplicate detection)
     - **LTIMindtree Culture & Fitment** (Learning agility, shift flexibility, and Pan-India relocation)

3. **Resume-Driven Dynamic Personalization**:
   - Upload any PDF, DOCX, or TXT resume, or paste text directly.
   - Includes 1-click pre-configured Fresher resumes (CS & IT, Web Dev, Circuit branch transition).
   - Automatically generates targeted drill-down questions based on the candidate's exact project tech stack.

4. **Actionable "Development Area" Diagnostic Report**:
   - **LTIMindtree Readiness Index (0–100)** with hiring verdict badges.
   - **Critical Development Areas (Weak Spots)**: Quotes the candidate's answer, identifies deficiencies, compares against LTIMindtree panel expectations, and provides concrete revision steps.
   - **7-Day Targeted Study Plan**: Daily checklist for placement preparation.
   - **Print / Save as PDF**: Clean, executive-ready offline report.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Open in browser (Chrome or Edge recommended for microphone support)
http://localhost:5173
```

---

## ⚡ Deploying to Vercel (Handles 5,000+ Concurrent Students)

This project has been architected for static edge distribution with zero server bottleneck:
- All speech recognition, text-to-speech, and NLP evaluation heuristics run directly in the student's browser via native Web APIs.
- Edge CDN caching headers and SPA routing are pre-configured in `vercel.json`.

### Option A: 1-Command CLI Deployment
```bash
npx vercel
```

### Option B: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects Vite with the included `vercel.json`.
4. Click **Deploy**. Your site will be live on a global CDN in under 60 seconds!
