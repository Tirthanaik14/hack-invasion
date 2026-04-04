export function SeverityBadge({ severity, status }) {
  if (status === 'resolved') {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-500/20 text-green-400 border border-green-500/50">
        Resolved
      </span>
    );
  }
  if (severity === 'critical') {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-500/20 text-red-400 border border-red-500/50">
        Critical
      </span>
    );
  }
  if (severity === 'warning') {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-500/20 text-amber-400 border border-amber-500/50">
        Warning
      </span>
    );
  }
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
      Low
    </span>
  );
}