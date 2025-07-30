import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SessionCard from '../components/SessionCard';
import { Plus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
  const { sessions, loading, fetchPublishedSessions } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    fetchPublishedSessions();
    
    // Check if user has seen welcome message before
    const hasSeenWelcome = localStorage.getItem(`welcomed_${user?.id}`);
    if (!hasSeenWelcome && user) {
      setShowWelcome(true);
      // Mark as seen after 5 seconds or when user dismisses
      setTimeout(() => {
        localStorage.setItem(`welcomed_${user.id}`, 'true');
      }, 5000);
    }
  }, [user]);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    if (user) {
      localStorage.setItem(`welcomed_${user.id}`, 'true');
    }
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message - Only shown on first visit */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white relative animate-slide-in-down">
            <button
              onClick={handleDismissWelcome}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}! 🌿
              </h2>
              <p className="text-emerald-100">
                Ready to explore new wellness sessions and create mindful moments? Your journey continues here.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Wellness Sessions
              </h1>
              <p className="text-gray-600">
                Connect with nature freely anywhere, anytime with us
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => navigate('/editor')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search wellness sessions..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Published Sessions</h2>
            <span className="text-sm text-gray-500">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions available</h3>
              <p className="text-gray-600 mb-6">Be the first to create and publish a wellness session!</p>
              <button
                onClick={() => navigate('/editor')}
                className="btn-primary"
              >
                Create Your First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sessions.map(session => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onView={handleViewSession}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {sessions.length}
            </div>
            <div className="text-gray-600">Published Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">∞</div>
            <div className="text-gray-600">Wellness Journey</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">🧘</div>
            <div className="text-gray-600">Mindful Moments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;