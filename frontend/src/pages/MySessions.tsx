import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import SessionCard from '../components/SessionCard';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const MySessions: React.FC = () => {
  const { sessions, loading, fetchUserSessions } = useSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'drafts' | 'published'>('drafts');
  
  useEffect(() => {
    fetchUserSessions();
  }, []);
  
  const draftSessions = sessions.filter(session => session.status === 'draft');
  const publishedSessions = sessions.filter(session => session.status === 'published');
  
  const currentSessions = activeTab === 'drafts' ? draftSessions : publishedSessions;

  const handleEditSession = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleViewSession = (id: string) => {
    navigate(`/session/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Sessions</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your wellness sessions and track your progress
              </p>
            </div>
            <button
              onClick={() => navigate('/editor')}
              className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">New Session</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('drafts')}
                className={`flex-1 sm:flex-none py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base text-center sm:text-left transition-colors duration-200 ${
                  activeTab === 'drafts'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="block sm:inline">Drafts</span>
                <span className="block sm:inline sm:ml-1">({draftSessions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`flex-1 sm:flex-none py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base text-center sm:text-left transition-colors duration-200 ml-4 sm:ml-8 ${
                  activeTab === 'published'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="block sm:inline">Published</span>
                <span className="block sm:inline sm:ml-1">({publishedSessions.length})</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sessions List */}
        <div>
          {currentSessions.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No {activeTab} yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                {activeTab === 'drafts' 
                  ? 'Start creating your first wellness session draft'
                  : 'Publish some sessions to see them here'
                }
              </p>
              <button
                onClick={() => navigate('/editor')}
                className="btn-primary w-full sm:w-auto px-6 py-3"
              >
                Create Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {currentSessions.map(session => (
                <SessionCard
                  key={session._id}
                  session={session}
                  showEdit={true}
                  onEdit={handleEditSession}
                  onView={handleViewSession}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {currentSessions.length > 0 && (
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white rounded-xl border border-gray-100">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Ready to create more?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Share your wellness expertise with the community
                </p>
              </div>
              <button
                onClick={() => navigate('/editor')}
                className="btn-primary w-full sm:w-auto px-6 py-3 text-sm sm:text-base"
              >
                Create New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;