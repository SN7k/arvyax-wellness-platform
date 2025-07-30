import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface Session {
  _id: string;
  user_id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface SessionContextType {
  sessions: Session[];
  loading: boolean;
  fetchUserSessions: () => Promise<void>;
  fetchPublishedSessions: () => Promise<void>;
  createSession: (sessionData: { title: string; tags: string[]; json_file_url: string }) => Promise<Session | null>;
  updateSession: (sessionId: string, sessionData: { title: string; tags: string[]; json_file_url: string }) => Promise<Session | null>;
  publishSession: (sessionId: string, showToast?: boolean) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  getSession: (id: string) => Session | undefined;
  saveDraft: (sessionData: { title: string; tags: string[]; json_file_url: string; sessionId?: string }, showToast?: boolean) => Promise<Session | null>;
  autoSaveDraft: (sessionData: { title: string; tags: string[]; json_file_url: string; sessionId?: string }, showToast?: boolean) => Promise<Session | null>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://arvyax-wellness-platform-js0w.onrender.com/api';

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch user's own sessions (draft + published)
  const fetchUserSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        setSessions(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Fetch user sessions error:', error);
      toast.error('Network error while fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch published sessions (public)
  const fetchPublishedSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      const data = await response.json();

      if (data.success) {
        setSessions(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch published sessions');
      }
    } catch (error) {
      console.error('Fetch published sessions error:', error);
      toast.error('Network error while fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  // Save or update a draft session
  const saveDraft = async (sessionData: { title: string; tags: string[]; json_file_url: string; sessionId?: string }, showToast: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions/save-draft`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSessions(prev => {
          if (sessionData.sessionId) {
            // Update existing session
            return prev.map(session => 
              session._id === sessionData.sessionId ? data.data : session
            );
          } else {
            // Add new session
            return [...prev, data.data];
          }
        });
        
        if (showToast) {
          toast.success(data.message);
        }
        return data.data;
      } else {
        if (showToast) {
          toast.error(data.message || 'Failed to save draft');
        }
        return null;
      }
    } catch (error) {
      console.error('Save draft error:', error);
      if (showToast) {
        toast.error('Network error while saving draft');
      }
      return null;
    }
  };

  // Auto-save functionality with toast feedback
  const autoSaveDraft = async (sessionData: { title: string; tags: string[]; json_file_url: string; sessionId?: string }, showToast: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions/save-draft`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSessions(prev => {
          if (sessionData.sessionId) {
            return prev.map(session => 
              session._id === sessionData.sessionId ? data.data : session
            );
          } else {
            return [...prev, data.data];
          }
        });
        
        // Show professional auto-save feedback only if showToast is true
        if (showToast) {
          toast.success('Draft saved automatically', { 
            duration: 3000,
            icon: '✓',
            style: {
              background: '#f0f9ff',
              color: '#1e40af',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            }
          });
        }
        
        return data.data;
      } else {
        // Silent error for auto-save - don't interrupt user
        console.error('Auto-save failed:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      return null;
    }
  };

  // Create a new session (alias for saveDraft without sessionId)
  const createSession = async (sessionData: { title: string; tags: string[]; json_file_url: string }) => {
    return await saveDraft(sessionData);
  };

  // Update an existing session
  const updateSession = async (sessionId: string, sessionData: { title: string; tags: string[]; json_file_url: string }) => {
    return await saveDraft({ ...sessionData, sessionId });
  };

  // Publish a session
  const publishSession = async (sessionId: string, showToast: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions/publish`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with the returned session data
        setSessions(prev => 
          prev.map(session => 
            session._id === sessionId ? data.data : session
          )
        );
        
        if (showToast) {
          toast.success(data.message);
        }
        return data.data; // Return the updated session data
      } else {
        if (showToast) {
          toast.error(data.message || 'Failed to publish session');
        }
        return false;
      }
    } catch (error) {
      console.error('Publish session error:', error);
      if (showToast) {
        toast.error('Network error while publishing session');
      }
      return false;
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/my-sessions/${sessionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSessions(prev => prev.filter(session => session._id !== sessionId));
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message || 'Failed to delete session');
        return false;
      }
    } catch (error) {
      console.error('Delete session error:', error);
      toast.error('Network error while deleting session');
      return false;
    }
  };

  // Get a specific session by ID
  const getSession = (id: string) => {
    return sessions.find(session => session._id === id);
  };

  const value = {
    sessions,
    loading,
    fetchUserSessions,
    fetchPublishedSessions,
    createSession,
    updateSession,
    publishSession,
    deleteSession,
    getSession,
    saveDraft,
    autoSaveDraft,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};