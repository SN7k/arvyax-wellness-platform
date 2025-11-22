// Mock data for demo login - no backend connection needed
import { Session } from '../context/SessionContext';

export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export const mockDemoUser: MockUser = {
  id: 'demo-user-12345',
  email: 'demo@arvyax.com',
  name: 'Demo User'
};

export const mockDemoToken = 'demo-jwt-token-12345-no-backend-needed';

export const mockSessions: Session[] = [
  {
    _id: 'session-001',
    user_id: 'demo-user-12345',
    title: 'Morning Meditation',
    tags: ['meditation', 'morning', 'mindfulness'],
    json_file_url: 'https://example.com/sessions/morning-meditation.json',
    status: 'published',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-002',
    user_id: 'demo-user-12345',
    title: 'Breathing Exercise',
    tags: ['breathing', 'relaxation', 'stress-relief'],
    json_file_url: 'https://example.com/sessions/breathing-exercise.json',
    status: 'published',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-003',
    user_id: 'demo-user-12345',
    title: 'Evening Yoga Flow',
    tags: ['yoga', 'evening', 'stretching'],
    json_file_url: 'https://example.com/sessions/evening-yoga.json',
    status: 'published',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-004',
    user_id: 'other-user-456',
    title: 'Nature Sounds Relaxation',
    tags: ['nature', 'sounds', 'relaxation'],
    json_file_url: 'https://example.com/sessions/nature-sounds.json',
    status: 'published',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-005',
    user_id: 'other-user-789',
    title: 'Guided Mindfulness',
    tags: ['mindfulness', 'guided', 'meditation'],
    json_file_url: 'https://example.com/sessions/guided-mindfulness.json',
    status: 'published',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-006',
    user_id: 'demo-user-12345',
    title: 'My Draft Session',
    tags: ['draft', 'work-in-progress'],
    json_file_url: 'https://example.com/sessions/draft-session.json',
    status: 'draft',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-007',
    user_id: 'other-user-321',
    title: 'Deep Sleep Meditation',
    tags: ['sleep', 'meditation', 'nighttime'],
    json_file_url: 'https://example.com/sessions/deep-sleep.json',
    status: 'published',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'session-008',
    user_id: 'other-user-654',
    title: 'Stress Relief Techniques',
    tags: ['stress', 'relief', 'wellness'],
    json_file_url: 'https://example.com/sessions/stress-relief.json',
    status: 'published',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
