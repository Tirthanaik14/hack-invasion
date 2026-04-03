export const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ago`
}

export const severityColor = (severity, status) => {
  if (status === 'resolved') return '#22c55e'
  if (severity === 'critical') return '#ef4444'
  if (severity === 'warning') return '#f59e0b'
  return '#3b82f6'
}
