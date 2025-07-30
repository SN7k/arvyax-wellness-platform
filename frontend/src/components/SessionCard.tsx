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
    <div className="card group h-full flex flex-col overflow-hidden">
      {/* Header with title and status */}
      <div className="flex flex-col space-y-2 mb-3 sm:mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2 flex-1 pr-2">
            {session.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
            session.status === 'published' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {session.status}
          </span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
          <span className="truncate">Updated {formatDate(session.updated_at)}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        {session.tags.slice(0, 4).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 max-w-full"
          >
            <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{tag}</span>
          </span>
        ))}
        {session.tags.length > 4 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-500">
            +{session.tags.length - 4} more
          </span>
        )}
      </div>

      {/* JSON URL - Always on its own line for better readability */}
      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2 py-1 bg-gray-50 rounded-md">
        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
        <span className="truncate font-mono text-xs">{session.json_file_url}</span>
      </div>

      {/* Actions - Always at bottom */}
      <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
        <div className="flex items-center justify-end gap-2">
          {showEdit && onEdit && (
            <button
              onClick={() => onEdit(session._id)}
              className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors duration-200 flex-shrink-0 border border-emerald-200 hover:border-emerald-300 min-w-[60px]"
              title="Edit Session"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Edit</span>
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(session._id)}
              className="flex items-center justify-center px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors duration-200 flex-shrink-0 min-w-[60px] max-w-[100px]"
              title="View Session"
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