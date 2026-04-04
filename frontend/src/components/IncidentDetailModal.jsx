import { useState } from 'react';
import { SeverityBadge } from './SeverityBadge';
import { timeAgo } from '../utils/timeAgo';
import { DisasterVisual } from './DisasterVisual';

export default function IncidentDetailModal({ incident, onClose, onStatusChange }) {
  const [verificationStep, setVerificationStep] = useState('report');
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      onStatusChange(incident.id, 'resolved');
      setIsResolving(false);
      onClose();
    }, 1000);
  };

  const handleAcknowledge = () => {
    onStatusChange(incident.id, 'acknowledged');
    setVerificationStep('verify');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900/95 to-blue-900/50 border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header with Visual */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border-b border-blue-500/30 p-6">
          <div className="flex items-start gap-6 mb-4">
            <DisasterVisual type={incident.type} size="large" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{incident.title}</h2>
              <p className="text-blue-300 text-sm font-semibold mb-3">Location: {incident.location_name}, Mumbai</p>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={incident.severity} status={incident.status} />
                <span className="text-xs text-gray-400">Reported {timeAgo(incident.created_at)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl font-light leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Verification Progress */}
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-300 uppercase mb-4">Verification Status</p>
            <div className="flex items-center justify-between">
              <div className={`text-center flex-1 transition ${verificationStep === 'report' || verificationStep === 'verify' || verificationStep === 'done' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white ${
                  verificationStep === 'report' || verificationStep === 'verify' || verificationStep === 'done'
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}>
                  1
                </div>
                <p className="text-xs text-gray-400 font-semibold">Report</p>
              </div>
              <div className="flex-1 h-1.5 bg-blue-500/20 mx-2"></div>
              <div className={`text-center flex-1 transition ${verificationStep === 'verify' || verificationStep === 'done' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white ${
                  verificationStep === 'verify' || verificationStep === 'done'
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}>
                  2
                </div>
                <p className="text-xs text-gray-400 font-semibold">Verify</p>
              </div>
              <div className="flex-1 h-1.5 bg-blue-500/20 mx-2"></div>
              <div className={`text-center flex-1 transition ${verificationStep === 'done' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white ${
                  verificationStep === 'done'
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                }`}>
                  3
                </div>
                <p className="text-xs text-gray-400 font-semibold">Done</p>
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-5">
            <p className="text-xs font-bold text-blue-300 uppercase mb-3">Incident Details</p>
            <p className="text-white text-sm leading-relaxed border-l-4 border-blue-500/50 pl-4 italic">
              "{incident.description}"
            </p>
            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-blue-500/20">
              Report submitted by: {incident.reporter_name || 'Anonymous'}
            </p>
          </div>

          {/* Location & Type Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-300 uppercase mb-3">Coordinates</p>
              <p className="text-white font-mono text-sm leading-relaxed">
                <span className="block text-gray-400 text-xs mb-1">Latitude</span>
                {incident.latitude?.toFixed(4)}
              </p>
              <p className="text-white font-mono text-sm leading-relaxed">
                <span className="block text-gray-400 text-xs mb-1">Longitude</span>
                {incident.longitude?.toFixed(4)}
              </p>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-300 uppercase mb-3">Incident Type</p>
              <p className="text-white font-bold text-sm capitalize mb-2">{incident.type}</p>
              <p className="text-gray-400 text-xs">
                <span className="block mb-1">Severity Level</span>
                <span className="text-blue-300 font-semibold capitalize">{incident.severity}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {incident.status === 'active' && (
              <button
                onClick={handleAcknowledge}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg transition shadow-lg"
              >
                Acknowledge Alert
              </button>
            )}

            {(incident.status === 'active' || incident.status === 'acknowledged') && (
              <button
                onClick={handleResolve}
                disabled={isResolving}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResolving ? 'Resolving Alert...' : 'Resolve Alert'}
              </button>
            )}

            {incident.status === 'resolved' && (
              <div className="w-full bg-gradient-to-r from-green-600/50 to-green-500/50 border border-green-500/50 text-green-200 font-bold py-3 rounded-lg text-center">
                Alert Resolved Successfully
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Close Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}