export type UserRole = 'student' | 'mentor';
export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type CareerTrack = 'AI Engineer' | 'Machine Learning Engineer';
export type CourseSelection = 'Artificial Intelligence & Machine Learning' | 'Data Science' | 'Cybersecurity' | 'Data Science (Preview)' | 'Cybersecurity (Preview)';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentPreferences {
  userId: string;
  collegeName?: string;
  academicYear?: AcademicYear;
  course?: CourseSelection;
  careerTrack?: CareerTrack;
  skillLevel?: SkillLevel;
  weeklyHours?: number;
  assignedMentorId?: string;
  onboardingCompleted?: boolean;
}

export interface MentorProfileData {
  userId: string;
  fullName: string;
  title: string;
  organization: string;
  bio: string;
  expertise: string[];
  courseSpecialization: string[];
  experienceYears: number;
  skills: string[];
  avatarUrl: string;
  maxStudents: number;
  assignedStudentIds: string[];
  isAcceptingMentees: boolean;
}

export type ResourceType = 'video' | 'documentation' | 'interactive' | 'practice' | 'book';

export interface CuratedResource {
  id: string;
  title: string;
  platform: string;
  url: string;
  type: ResourceType;
  duration?: string;
  isFree: boolean;
}

export interface RoadmapTopic {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resources: CuratedResource[];
  practicalExercise: {
    title: string;
    description: string;
    starterCodeSnippet?: string;
    expectedOutcome: string;
  };
  isRequired: boolean;
  completed?: boolean;
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  order: number;
  yearLevel: AcademicYear;
  estimatedWeeks: number;
  topics: RoadmapTopic[];
}

export interface CareerRoadmap {
  id: string;
  track: CareerTrack;
  academicYear: AcademicYear;
  title: string;
  description: string;
  totalHours: number;
  modules: RoadmapModule[];
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Capstone';
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: ProjectDifficulty;
  techStack: string[];
  requiredSkills: string[];
  estimatedHours: number;
  relatedModuleId: string;
  targetYear: AcademicYear[];
  careerTrack: CareerTrack[];
  learningOutcomes: string[];
  milestones: ProjectMilestone[];
  starterGuide?: string;
  repoUrl?: string;
  status: ProjectStatus;
}

export interface InternshipItem {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  duration: string;
  eligibilityYears: AcademicYear[];
  requiredSkills: string[];
  deadline?: string;
  description: string;
  applyUrl: string;
  isDemoListing: boolean;
  isSaved?: boolean;
}

export type MentorResourceType = 'PDF' | 'Notes' | 'Video link' | 'Documentation link' | 'Dataset link' | 'Assignment';

export interface SharedResourceItem {
  id: string;
  title: string;
  description: string;
  resourceType: MentorResourceType;
  url: string;
  mentorId: string;
  mentorName: string;
  targetStudentId: string | 'all'; // 'all' or specific student ID
  targetStudentName?: string;
  createdAt: string;
  fileSize?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}

export type SkillAssessmentRating = 'unassessed' | 'proficient' | 'needs_revision';

export interface ReadinessSkillItem {
  id: string;
  domain: string;
  name: string;
  importance: 'Critical' | 'High' | 'Medium';
  description: string;
  interviewRelevance: string;
  revisionTip: string;
}

export interface RevisionPlanTopic {
  id: string;
  moduleName: string;
  title: string;
  estimatedHours: number;
  coreConcepts: string[];
  keyFormulasOrTakeaways: string;
  resources: CuratedResource[];
}

export interface InterviewPrepItem {
  id: string;
  track: CareerTrack;
  question: string;
  category: 'System Design' | 'Theory & Math' | 'Practical Coding' | 'MLOps & Deployment';
  difficulty: 'Intermediate' | 'Advanced';
  sampleAnswer: string;
  codeSnippet?: string;
  keyEvaluationPoint: string;
}

