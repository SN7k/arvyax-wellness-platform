import React from 'react';
import { Session } from '../context/SessionContext';
import { Calendar, Tag, ExternalLink, Edit } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  showEdit?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  showEdit = false, 
  onEdit, 
  onView 
}) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="card group h-full flex flex-col">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
            {session.title}
          </h3>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">Updated {formatDate(session.updated_at)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
            session.status === 'published' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {session.status}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        {session.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
          >
            <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate max-w-[80px] sm:max-w-none">{tag}</span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 sm:pt-4 border-t border-gray-100 mt-auto space-y-2 sm:space-y-0">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
          <span className="truncate max-w-[150px] sm:max-w-[200px]">{session.json_file_url}</span>
        </div>
        <div className="flex items-center justify-end space-x-2 order-1 sm:order-2">
          {showEdit && onEdit && (
            <button
              onClick={() => onEdit(session._id)}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors duration-200 flex-shrink-0"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(session._id)}
              className="btn-secondary py-1.5 px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;