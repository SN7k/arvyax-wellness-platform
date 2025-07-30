import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession, Session } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { ArrowLeft, Calendar, Tag, ExternalLink, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, fetchPublishedSessions } = useSession();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      
      // First try to find in current sessions
      const foundSession = sessions.find(s => s._id === id);
      
      if (foundSession) {
        setSession(foundSession);
        setLoading(false);
      } else {
        // If not found, fetch published sessions
        await fetchPublishedSessions();
        const refetchedSession = sessions.find(s => s._id === id);
        
        if (refetchedSession) {
          setSession(refetchedSession);
        } else {
          toast.error('Session not found');
          navigate('/dashboard');
        }
        setLoading(false);
      }
    };

    if (id) {
      loadSession();
    }
  }, [id, sessions, fetchPublishedSessions, navigate]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleViewJSON = () => {
    if (session?.json_file_url) {
      window.open(session.json_file_url, '_blank');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">The session you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full sm:w-auto"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Sessions</span>
          </button>
        </div>

        {/* Session Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight break-words">{session.title}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full self-start whitespace-nowrap ${
                  session.status === 'published' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Created {formatDate(session.created_at)}</span>
                </div>
                {session.updated_at !== session.created_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Updated {formatDate(session.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {session.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-700"
                  >
                    <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-[120px] sm:max-w-none">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Session Data */}
          <div className="border-t border-gray-100 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Session Data</h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">JSON File URL</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-all">{session.json_file_url}</p>
                  </div>
                </div>
                <button
                  onClick={handleViewJSON}
                  className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto flex-shrink-0"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Actions</h3>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleViewJSON}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Session Data</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-emerald-50 rounded-xl border border-emerald-100">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-3 sm:mb-4">💡 About This Session</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-emerald-700">
            <li>• This wellness session contains structured data for meditation, yoga, or mindfulness practices</li>
            <li>• Click "View Data" to explore the JSON file with session instructions and content</li>
            <li>• Sessions can be used in wellness apps, meditation platforms, or personal practice tools</li>
            <li>• The data format follows wellness industry standards for compatibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
