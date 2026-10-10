import { ProjectItem, ProjectStatus } from '../types';
import { INITIAL_PROJECTS } from '../data/projectData';
import { storageHelper } from './supabase';

/**
 * Storage key prefix for student projects.
 * Scoped to user ID: student_projects_list_<userId>
 */
const PROJECTS_STORAGE_PREFIX = 'student_projects_list_';
const LEGACY_STORAGE_KEY = 'student_projects_list';

/**
 * Resolves the authenticated user ID safely from context or local storage.
 */
function resolveUserId(providedUserId?: string): string | null {
  if (providedUserId && providedUserId.trim() !== '') {
    return providedUserId;
  }
  try {
    const savedUser = storageHelper.get<{ id?: string } | null>('current_user', null);
    if (savedUser?.id && savedUser.id.trim() !== '') {
      return savedUser.id;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Creates clean initial projects catalog where every project starts
 * with 'Not Started' and all milestones uncompleted.
 * Catalogue integrity is preserved.
 */
function getCleanInitialProjects(): ProjectItem[] {
  return INITIAL_PROJECTS.map(project => ({
    ...project,
    status: 'Not Started',
    milestones: project.milestones.map(m => ({
      ...m,
      completed: false,
    })),
    repoUrl: undefined,
  }));
}

export const projectService = {
  /**
   * Returns the project list for a specific user.
   * If userId is not provided, attempts to resolve from current_user session.
   * New users start with fresh, independent 0% progress.
   */
  getProjects(userId?: string): ProjectItem[] {
    const resolvedId = resolveUserId(userId);
    if (!resolvedId) {
      // Unauthenticated or unknown user: return fresh catalogue without saving or polluting
      return getCleanInitialProjects();
    }

    const userKey = `${PROJECTS_STORAGE_PREFIX}${resolvedId}`;
    const cleanCatalog = getCleanInitialProjects();

    // Check if user already has saved project list
    const existing = storageHelper.get<ProjectItem[] | null>(userKey, null);
    if (existing && Array.isArray(existing)) {
      return existing;
    }

    // Check for safe legacy data migration:
    // Only migrate if legacy data belongs to the default demo student ('student-demo-1')
    if (resolvedId === 'student-demo-1') {
      const legacyData = storageHelper.get<ProjectItem[] | null>(LEGACY_STORAGE_KEY, null);
      if (legacyData && Array.isArray(legacyData)) {
        storageHelper.set(userKey, legacyData);
        return legacyData;
      }
    }

    // New user starts with clean, independent progress
    storageHelper.set(userKey, cleanCatalog);
    return cleanCatalog;
  },

  /**
   * Returns a specific project by ID for the user.
   */
  getProjectById(id: string, userId?: string): ProjectItem | undefined {
    const list = this.getProjects(userId);
    return list.find(p => p.id === id);
  },

  /**
   * Toggles milestone completion for a specific project and saves to user's storage.
   */
  toggleMilestone(projectId: string, milestoneId: string, userId?: string): ProjectItem | null {
    const resolvedId = resolveUserId(userId);
    if (!resolvedId) return null;

    const list = this.getProjects(resolvedId);
    const project = list.find(p => p.id === projectId);
    if (!project) return null;

    const updatedMilestones = project.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);
    const anyCompleted = updatedMilestones.some(m => m.completed);
    let newStatus: ProjectStatus = project.status;
    if (allCompleted) newStatus = 'Completed';
    else if (anyCompleted) newStatus = 'In Progress';
    else newStatus = 'Not Started';

    const updatedProject: ProjectItem = {
      ...project,
      milestones: updatedMilestones,
      status: newStatus,
    };

    const updatedList = list.map(p => (p.id === projectId ? updatedProject : p));
    const userKey = `${PROJECTS_STORAGE_PREFIX}${resolvedId}`;
    storageHelper.set(userKey, updatedList);
    return updatedProject;
  },

  /**
   * Updates project status and optional GitHub repo URL for the user.
   */
  updateProjectStatus(projectId: string, status: ProjectStatus, repoUrl?: string, userId?: string): ProjectItem | null {
    const resolvedId = resolveUserId(userId);
    if (!resolvedId) return null;

    const list = this.getProjects(resolvedId);
    const project = list.find(p => p.id === projectId);
    if (!project) return null;

    const updatedProject: ProjectItem = {
      ...project,
      status,
      repoUrl: repoUrl !== undefined ? repoUrl : project.repoUrl,
    };

    const updatedList = list.map(p => (p.id === projectId ? updatedProject : p));
    const userKey = `${PROJECTS_STORAGE_PREFIX}${resolvedId}`;
    storageHelper.set(userKey, updatedList);
    return updatedProject;
  },

  /**
   * Clears any cached in-memory project references on logout.
   */
  clearSessionState(): void {
    // State is read on-demand per user ID key; no memory leak across sessions
  },
};
