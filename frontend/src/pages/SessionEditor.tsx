import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import { Save, Eye, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSession, saveDraft, autoSaveDraft, publishSession } = useSession();
  
  // Track if component is mounted to control toast display
  const isMountedRef = useRef(true);
  
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<number | null>(null);
  const [sessionStatus, setSessionStatus] = useState<'draft' | 'published'>('draft');

  // Set up component lifecycle tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (id) {
      const session = getSession(id);
      if (session) {
        setFormData({
          title: session.title,
          tags: session.tags.join(', '),
          json_file_url: session.json_file_url
        });
        setIsEditing(true);
        setSessionStatus(session.status);
      } else {
        toast.error('Session not found');
        navigate('/my-sessions');
      }
    }
  }, [id, getSession, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Only auto-save if there's content and user is not actively saving manually
    if ((formData.title.trim() || formData.tags.trim() || formData.json_file_url.trim()) && !isSaving) {
      const timeout = setTimeout(() => {
        handleAutoSave();
      }, 5000); // 5 seconds after inactivity
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, isSaving]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleAutoSave = async () => {
    if (!formData.title.trim()) return;

    setIsAutoSaving(true);

    const sessionData = {
      title: formData.title.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      json_file_url: formData.json_file_url.trim(),
      sessionId: isEditing && id ? id : undefined
    };

    // Only show toast if component is still mounted and it's not a published session being auto-saved
    const showToast = isMountedRef.current && sessionStatus !== 'published';
    const result = await autoSaveDraft(sessionData, showToast);
    
    if (result) {
      setLastSaved(new Date());
      
      // If it's a new session, update the URL and set editing mode
      if (!isEditing && result._id) {
        navigate(`/editor/${result._id}`, { replace: true });
        setIsEditing(true);
      }
    }
    
    setIsAutoSaving(false);
  };

  const handleSave = async (shouldPublish = false) => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);

    try {
      const sessionData = {
        title: formData.title.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        json_file_url: formData.json_file_url.trim(),
        sessionId: isEditing && id ? id : undefined
      };

      // Don't show toast for saveDraft when we're going to publish
      const result = await saveDraft(sessionData, !shouldPublish);

      if (result) {
        setLastSaved(new Date());

        if (shouldPublish) {
          // Check if it's already published
          if (sessionStatus === 'published') {
            // For published sessions, just update without republishing
            setSessionStatus('published');
            toast.success('Session updated successfully!');
          } else {
            // For draft sessions, publish them (don't show publishSession toast)
            const publishResult = await publishSession(result._id, false);
            if (publishResult) {
              setSessionStatus('published');
              toast.success('Session published successfully!');
            }
          }
        } else {
          // Save as draft - toast already shown by saveDraft
          if (!isEditing) {
            // New session saved as draft
            navigate(`/editor/${result._id}`, { replace: true });
            setIsEditing(true);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/my-sessions')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 mt-1 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {isEditing ? 'Edit Session' : 'Create New Session'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {isEditing ? 'Update your wellness session' : 'Design a new wellness experience'}
                </p>
              </div>
            </div>
            
            {/* Session Status Badge */}
            {isEditing && (
              <div className="flex items-center justify-start sm:justify-end">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sessionStatus === 'published' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {sessionStatus === 'published' ? '✅ Published' : '📝 Draft'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a compelling title for your wellness session"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="meditation, mindfulness, breathing (separate with commas)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help users discover your session
              </p>
            </div>

            {/* JSON File URL */}
            <div>
              <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">
                Session Data URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="json_file_url"
                  name="json_file_url"
                  value={formData.json_file_url}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="https://example.com/session-data.json"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Link to your session configuration JSON file
              </p>
            </div>

            {/* Preview Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Session Preview</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {formData.title || 'Untitled Session'}
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    return trimmedTag ? (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {trimmedTag}
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  {formData.json_file_url || 'No session data URL provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 text-sm">
                {isSaving && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
                    <span className="font-medium">
                      {sessionStatus === 'published' ? 'Updating session...' : 'Publishing session...'}
                    </span>
                  </div>
                )}
                {isAutoSaving && !isSaving && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-gray-600"></div>
                    <span className="font-medium">Auto-saving changes...</span>
                  </div>
                )}
                {!isSaving && !isAutoSaving && lastSaved && (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">All changes saved</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Only show Save Draft button for draft sessions */}
                {sessionStatus === 'draft' && (
                  <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving || !formData.title.trim()}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>{sessionStatus === 'published' ? 'Update' : 'Publish'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;