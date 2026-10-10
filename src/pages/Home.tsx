import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Bot,
  Users,
  FolderGit2,
  Briefcase,
  CheckCircle2,
  Cpu,
  Layers,
  GraduationCap,
  ShieldAlert,
  Zap,
  BookOpen,
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] text-[#27272A] dark:text-[#FAFAFA] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/50 dark:from-rose-950/20 to-pink-100/50 dark:to-zinc-900/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-rose-200 dark:border-zinc-700 shadow-sm text-xs font-semibold text-[#9F1239] dark:text-rose-300 mb-6">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Built for Engineering Students • AI & ML Curricula</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#4C0519] dark:text-[#FAFAFA] max-w-4xl mx-auto leading-[1.1]">
            Your Career. <br />
            <span className="text-gradient-brand">Your Roadmap.</span> Your Future.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what to study next. SkillBridge AI generates year-specific AI and Machine Learning roadmaps, guides you through portfolio projects, pairs you with verified human mentors, and unlocks relevant internships.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 hover:opacity-95 transition-all group"
            >
              <span>Build My Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-sm sm:text-base border border-rose-200 dark:border-zinc-700 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
            >
              Explore Platform Features
            </a>
          </div>

          {/* Preview Hero Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-zinc-950 p-4 sm:p-6 shadow-2xl border border-zinc-800 text-left text-zinc-200 relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-zinc-400">SkillBridge Dashboard Preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60">
                2nd Year • Machine Learning Engineer Track
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Roadmap Milestone Progress</div>
                <div className="text-2xl font-bold text-rose-300">62% Completed</div>
                <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="h-full gradient-brand w-[62%]" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">11 of 18 Core Topics Mastered</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Current Active Module</div>
                <div className="text-sm font-bold text-zinc-100">Supervised Learning & Ensemble Methods</div>
                <div className="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Next: XGBoost Hyperparameter Tuning
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Guidance Dual Engine</div>
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
                  <Bot className="w-3.5 h-3.5 text-rose-400" /> AI Assistant: Active 24/7
                </div>
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-rose-400" /> Mentor: Dr. Maya Lin (Assigned)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="features" className="py-20 bg-white dark:bg-[#27272A] border-y border-rose-100 dark:border-[#3F3F46] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9F1239] dark:text-rose-400 mb-2">
              Comprehensive Student Experience
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#4C0519] dark:text-[#FAFAFA]">
              Engineered for Real-World AI & ML Readiness
            </h3>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              Everything an undergraduate needs to navigate the transition from classroom theory to high-impact technical roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <Compass className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Personalized Learning Roadmaps
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Year-adapted schedules: 4-year foundations for 1st years, accelerated modules for 2nd/3rd years, and skill-gap sprints for graduating seniors.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                Explore Curriculum <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <Bot className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  AI Career Assistant
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Instant, contextual technical explanations, code reviews, and study guidance powered securely by server-side Gemini 3.8 Flash.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                Try AI Chat <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <Users className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Personal Human Mentorship
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Real faculty and industry mentors with dedicated workspaces who can review project progress and upload exclusive learning materials.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                Meet Mentors <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <FolderGit2 className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Practical Portfolio Projects
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Move beyond toy notebooks with structured milestones, starter architectures, and testable specifications in Python, PyTorch, and FastAPI.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                View Projects <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <Briefcase className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Internship Discovery
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Curated opportunities filtered by academic eligibility. 1st years focus on foundational projects first; 2nd–4th years access verified postings.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                Browse Internships <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#FFF1F2]/60 dark:bg-zinc-900/70 border border-rose-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-rose-200" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Real-Time Progress Tracking
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Topic checklists, milestone tracking, and dynamic completion formulas that keep you accountable throughout each academic semester.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800 text-xs font-semibold text-[#9F1239] dark:text-rose-400 flex items-center gap-1">
                Track Milestones <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-[#FFF1F2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9F1239] mb-2">
              Simple 6-Step Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#4C0519]">
              How SkillBridge AI Guides You
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Academic Year',
                desc: 'Select 1st, 2nd, 3rd, or 4th Year. The system tailors your pacing to the time remaining until graduation.',
              },
              {
                step: '02',
                title: 'Select Course & Career Path',
                desc: 'Pick between AI Engineer or Machine Learning Engineer for complete curricula, with preview options for other domains.',
              },
              {
                step: '03',
                title: 'Receive Tailored Roadmap',
                desc: 'Get sequential modules with estimated hours, verified free resources from 3Blue1Brown, StatQuest, and official docs.',
              },
              {
                step: '04',
                title: 'Build Practical Projects',
                desc: 'Implement hands-on projects matching each milestone to build an authentic GitHub engineering portfolio.',
              },
              {
                step: '05',
                title: 'Track Milestone Progress',
                desc: 'Mark topics complete to calculate dynamic percentages, unlock badges, and monitor study hours.',
              },
              {
                step: '06',
                title: 'Dual-Source Mentorship',
                desc: 'Receive on-demand AI answers 24/7 alongside direct guidance and resource sharing from your personal human mentor.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white border border-rose-100 shadow-sm relative overflow-hidden"
              >
                <div className="text-3xl font-extrabold text-[#FDA4AF] mb-3">
                  {item.step}
                </div>
                <h4 className="text-base font-bold text-zinc-900 mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI VS PERSONAL MENTOR COMPARISON */}
      <section id="ai-guidance" className="py-20 bg-white border-y border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9F1239] mb-2">
              Dual Guidance Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#4C0519]">
              AI Career Assistant vs. Personal Human Mentor
            </h3>
            <p className="mt-3 text-zinc-600 text-sm sm:text-base">
              Why settle for one when both fulfill complementary roles in an engineering student's career development?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* AI Assistant Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF1F2] border-2 border-rose-200/80 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white">
                    <Bot className="w-6 h-6 text-rose-200" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#4C0519]">AI Career Assistant</h4>
                    <span className="text-xs font-semibold text-[#9F1239]">On-Demand 24/7 Engine</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 mt-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9F1239] shrink-0 mt-0.5" />
                    <span>Instant mathematical and code explanations whenever you are stuck</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9F1239] shrink-0 mt-0.5" />
                    <span>Always aware of your completed topics and current module context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9F1239] shrink-0 mt-0.5" />
                    <span>Brainstorms beginner-friendly project architectures and unit tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9F1239] shrink-0 mt-0.5" />
                    <span>Unlimited questions without fear of asking "basic" queries</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-rose-200 text-xs font-medium text-zinc-500">
                Best for: Immediate late-night debugging & concept comprehension
              </div>
            </div>

            {/* Human Mentor Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                    <Users className="w-6 h-6 text-rose-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900">Personal Human Mentor</h4>
                    <span className="text-xs font-semibold text-zinc-600">Faculty & Industry Specialist</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 mt-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Uploads bespoke lecture notes, PDFs, and curated assignments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Performs senior code reviews on capstones and portfolio repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Provides industry career wisdom, referral guidance, and research advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Accountability partner for semester-long milestone completion</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 text-xs font-medium text-zinc-500">
                Best for: Strategic career positioning, portfolio critique & bespoke resources
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER TRACKS PREVIEW */}
      <section className="py-20 bg-[#FFF1F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9F1239] mb-2">
              Curriculum Specializations
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#4C0519]">
              Fully Implemented AI/ML Tracks
            </h3>
            <p className="mt-3 text-zinc-600 text-sm sm:text-base">
              Detailed curricula with verified starter resources, hands-on exercises, and project blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Track 1: AI Engineer */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239]">
                    Full Curriculum Active
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">1st – 4th Year Tracks</span>
                </div>
                <h4 className="text-2xl font-bold text-[#4C0519] mb-2">AI Engineer</h4>
                <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
                  Focuses on building software powered by modern Foundation Models, LLM application architecture, vector databases, retrieval-augmented generation (RAG), and high-throughput APIs.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold text-zinc-800">Key Curriculum Modules:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Python OOP & Clean Code',
                      'Linear Algebra & Gradients',
                      'Classical ML & Scikit-learn',
                      'PyTorch & Autograd',
                      'Transformers & Self-Attention',
                      'Vector DBs & RAG Architecture',
                      'FastAPI & Serving',
                      'LLMOps & Evaluation Frameworks',
                    ].map((m, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-rose-50 text-rose-900 border border-rose-200 font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/onboarding"
                className="w-full py-3 px-4 rounded-xl gradient-brand text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20"
              >
                Enroll in AI Engineer Track <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Track 2: Machine Learning Engineer */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239]">
                    Full Curriculum Active
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">1st – 4th Year Tracks</span>
                </div>
                <h4 className="text-2xl font-bold text-[#4C0519] mb-2">Machine Learning Engineer</h4>
                <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
                  Deeply rigorous modeling engineering: mathematical optimization, feature engineering, ensemble algorithms (XGBoost/LightGBM), experiment tracking (MLflow), and MLOps telemetry.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold text-zinc-800">Key Curriculum Modules:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Scientific NumPy & Vectorization',
                      'Probability & Inferential Stats',
                      'Supervised & Unsupervised ML',
                      'Feature Engineering & PCA',
                      'PyTorch Deep Architectures',
                      'MLflow Experiment Tracking',
                      'Dockerized Model Serving',
                      'Evidently AI Drift Monitoring',
                    ].map((m, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-rose-50 text-rose-900 border border-rose-200 font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/onboarding"
                className="w-full py-3 px-4 rounded-xl gradient-brand text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20"
              >
                Enroll in ML Engineer Track <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Limited Preview Banner for Other Domains */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Transparent Notice on Additional Curricula:</span>
              <p className="mt-0.5 text-amber-800">
                Data Science and Cybersecurity tracks are currently in <strong>Limited Preview</strong>. Only the AI Engineer and Machine Learning Engineer pathways feature verified, fully fleshed-out four-year modules, starter repositories, and verified resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready to Take Control of Your AI/ML Career?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Join engineering students across the country following structured, project-backed roadmaps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-950/50 hover:opacity-95 transition-opacity"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm sm:text-base border border-zinc-700 transition-colors"
            >
              Log In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 text-xs border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
            </div>
            <span className="font-bold text-sm text-zinc-200">SkillBridge AI</span>
            <span className="text-zinc-500">• Hackathon Edition 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <Link to="/roadmap" className="hover:text-zinc-200 transition-colors">Roadmaps</Link>
            <Link to="/projects" className="hover:text-zinc-200 transition-colors">Projects</Link>
            <Link to="/mentors" className="hover:text-zinc-200 transition-colors">Mentorship</Link>
            <Link to="/internships" className="hover:text-zinc-200 transition-colors">Internships</Link>
            <Link to="/ai-assistant" className="hover:text-zinc-200 transition-colors">AI Assistant</Link>
          </div>

          <p className="text-zinc-500 text-center sm:text-right">
            Curated verified starter links & open resources.
          </p>
        </div>
      </footer>
    </div>
  );
};
