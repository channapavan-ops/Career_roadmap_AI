# SkillBridge AI — Curriculum to Career Engine

**SkillBridge AI** is an intelligent, personalized career roadmap, human mentorship, and project-based learning platform for engineering students in **Artificial Intelligence & Machine Learning**.

Built for engineering undergraduates, SkillBridge AI bridges the gap between academic textbooks and top-tier industry engineering roles.

---

## 🌟 Key Features

1. **Year-Adapted Roadmap Engine**:
   - **1st Year**: Comprehensive 4-year foundational plan (Python, OOP, Linear Algebra, Calculus, Git).
   - **2nd Year**: Accelerated 3-year schedule focusing on Data Science, Scikit-learn, and classical ML algorithms.
   - **3rd Year**: Intensive 2-year deep learning, PyTorch autograd, API deployment, and internship interview preparation.
   - **4th Year**: Dedicated **Senior Job-Readiness Sprint & Skill-Gap Assessment** (identifying weak concepts, deploying production capstone microservices, and interview drills).

2. **Career Track Specialization**:
   - **AI Engineer Track**: Focuses on Foundation Models, RAG architectures, Vector DBs, Prompt Engineering, and FastAPI.
   - **Machine Learning Engineer Track**: Focuses on feature engineering, mathematical loss optimization, XGBoost, MLflow experiment tracking, and MLOps drift monitoring.
   - *Data Science & Cybersecurity*: Clearly labeled as Limited Preview.

3. **Dual Guidance Engine**:
   - **AI Career Assistant**: 24/7 technical explanations, code reviews, and roadmap recommendations powered securely by server-side **Gemini 3.8 Flash**.
   - **Personal Human Mentor**: Dedicated human faculty and industry mentors with workspaces to guide students and upload exclusive notes and assignments.

4. **Hands-On Portfolio Projects**:
   - Realistic starter blueprints with milestone checkboxes, unit testing expectations, and GitHub repository submission tracking.

5. **Internship Discovery**:
   - 1st-year students receive an encouraging foundations notice advising them to focus on foundational projects first.
   - 2nd–4th-year students access curated opportunities with workplace and role filters and bookmarking.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide Icons, Canvas Confetti.
- **Backend**: Express with TypeScript (`tsx`), Vite middleware mode in development.
- **AI Integration**: `@google/genai` calling `gemini-3.8-flash` exclusively from server routes.
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage.
- **Offline / Demo Resilience**: Instant zero-friction one-click demo personas and localStorage fallback.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
# Gemini API Key (injected automatically in AI Studio)
GEMINI_API_KEY="your_api_key_here"

# Supabase Credentials (optional for cloud sync; demo mode works offline out of the box)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Database Setup (Supabase)
To enable cloud database persistence:
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Run the SQL script located at `supabase/schema.sql`.
4. Create a storage bucket named `mentor-resources`.

---

## 👥 Hackathon Personas (1-Click Evaluation)
Use the quick persona switcher in the navbar or sidebar:
- **Aarav Sharma**: 2nd Year ML Engineer Student.
- **Neha Verma**: 4th Year Senior AI Engineer (Job-Ready Sprint Mode).
- **Dr. Maya Lin**: Staff Research Scientist & Mentor.
