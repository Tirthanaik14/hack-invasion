import { timeAgo } from '../utils/timeAgo';
import { SeverityBadge } from './SeverityBadge';
import { DisasterVisual } from './DisasterVisual';

export default function IncidentCard({ incident, onSelectIncident, isSelected }) {
  const getStatusColor = (status) => {
    if (status === 'resolved') return 'border-l-green-500';
    if (status === 'acknowledged') return 'border-l-blue-500';
    return 'border-l-red-500';
  };

  const statusText = {
    active: 'Active',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved'
  };

  return (
    <div
      onClick={() => onSelectIncident(incident)}
      className={`group bg-gradient-to-r from-gray-900/80 to-blue-900/40 border-l-4 ${getStatusColor(incident.status)} border border-blue-500/30 rounded-lg overflow-hidden cursor-pointer transition hover:border-blue-500/60 hover:bg-gradient-to-r hover:from-gray-900/90 hover:to-blue-900/60 ${
        isSelected ? 'border-blue-400/80 bg-gradient-to-r from-gray-900/95 to-blue-900/70' : ''
      }`}
    >
      <div className="flex items-stretch">
        {/* Visual Icon */}
        <div className="w-24 h-24 flex-shrink-0 p-2">
          <DisasterVisual type={incident.type} size="medium" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-white font-bold text-sm leading-tight flex-1 group-hover:text-blue-200 transition">
                {incident.title}
              </h3>
              <SeverityBadge severity={incident.severity} status={incident.status} />
            </div>
            
            <p className="text-blue-300 text-xs font-medium mb-2">
              Location: {incident.location_name}
            </p>

            <p className="text-gray-400 text-xs line-clamp-1">
              {incident.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-500/20">
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">
                {incident.reporter_name && incident.reporter_name !== 'Anonymous' 
                  ? `Report: ${incident.reporter_name}` 
                  : 'Report: Anonymous'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                incident.status === 'resolved' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : incident.status === 'acknowledged'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {statusText[incident.status]}
              </span>
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {timeAgo(incident.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}