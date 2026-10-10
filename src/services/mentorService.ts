import { MentorProfileData, SharedResourceItem } from '../types';
import { INITIAL_MENTORS, INITIAL_SHARED_RESOURCES } from '../data/mentorData';
import { storageHelper } from './supabase';

const MENTORS_KEY = 'mentors_directory';
const SHARED_RESOURCES_KEY = 'mentor_shared_resources';
const MENTOR_REQUESTS_KEY = 'student_mentor_requests';

export interface MentorRequest {
  mentorId: string;
  studentId: string;
  studentName: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export const mentorService = {
  getMentors(): MentorProfileData[] {
    return storageHelper.get<MentorProfileData[]>(MENTORS_KEY, INITIAL_MENTORS);
  },

  getMentorById(id: string): MentorProfileData | undefined {
    return this.getMentors().find(m => m.userId === id);
  },

  getSharedResources(): SharedResourceItem[] {
    return storageHelper.get<SharedResourceItem[]>(SHARED_RESOURCES_KEY, INITIAL_SHARED_RESOURCES);
  },

  getResourcesForStudent(studentId: string): SharedResourceItem[] {
    const all = this.getSharedResources();
    return all.filter(r => r.targetStudentId === 'all' || r.targetStudentId === studentId);
  },

  getResourcesByMentor(mentorId: string): SharedResourceItem[] {
    const all = this.getSharedResources();
    return all.filter(r => r.mentorId === mentorId);
  },

  addSharedResource(resource: Omit<SharedResourceItem, 'id' | 'createdAt'>): SharedResourceItem {
    const all = this.getSharedResources();
    const newItem: SharedResourceItem = {
      ...resource,
      id: 'res-shared-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...all];
    storageHelper.set(SHARED_RESOURCES_KEY, updated);
    return newItem;
  },

  getRequests(): MentorRequest[] {
    return storageHelper.get<MentorRequest[]>(MENTOR_REQUESTS_KEY, [
      {
        mentorId: 'mentor-1',
        studentId: 'student-demo-1',
        studentName: 'Aarav Sharma',
        note: 'Interested in mastering foundation models and PyTorch internals for my 2nd-year ML projects.',
        status: 'accepted',
        createdAt: '2026-09-01T10:00:00Z',
      },
    ]);
  },

  sendRequest(mentorId: string, studentId: string, studentName: string, note: string): MentorRequest {
    const all = this.getRequests();
    const existingIndex = all.findIndex(r => r.mentorId === mentorId && r.studentId === studentId);
    const newReq: MentorRequest = {
      mentorId,
      studentId,
      studentName,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let updated: MentorRequest[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = newReq;
    } else {
      updated = [newReq, ...all];
    }

    storageHelper.set(MENTOR_REQUESTS_KEY, updated);
    return newReq;
  },

  updateRequestStatus(mentorId: string, studentId: string, status: 'accepted' | 'declined'): void {
    const all = this.getRequests();
    const updated = all.map(r =>
      r.mentorId === mentorId && r.studentId === studentId ? { ...r, status } : r
    );
    storageHelper.set(MENTOR_REQUESTS_KEY, updated);
  },
};
