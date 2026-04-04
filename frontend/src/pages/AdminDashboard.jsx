import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IncidentCard from '../components/IncidentCard';
import IncidentDetailModal from '../components/IncidentDetailModal';

export default function AdminDashboard({ token, onLogout }) {
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      title: 'Flash Flood - Dharavi',
      type: 'flood',
      severity: 'critical',
      status: 'active',
      reporter_name: 'Ravi Kumar',
      location_name: 'Dharavi',
      latitude: 19.0176,
      longitude: 72.8194,
      created_at: new Date(Date.now() - 5 * 60000).toISOString(),
      description: 'Severe waterlogging affecting main roads. Water level rising. Emergency drainage teams deployed.'
    },
    {
      id: 2,
      title: 'Waterlogging - Kurla Station',
      type: 'flood',
      severity: 'warning',
      status: 'acknowledged',
      reporter_name: 'Anonymous',
      location_name: 'Kurla',
      latitude: 19.0752,
      longitude: 72.8653,
      created_at: new Date(Date.now() - 38 * 60000).toISOString(),
      description: 'Water pooling near railway station. Traffic being diverted. Drainage pumps in operation.'
    },
    {
      id: 3,
      title: 'Power Outage - Bandra West',
      type: 'infrastructure',
      severity: 'warning',
      status: 'active',
      reporter_name: 'Priya S',
      location_name: 'Bandra West',
      latitude: 19.0176,
      longitude: 72.8297,
      created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      description: 'Multiple residential buildings without electricity. Backup generators deployed. BEST power teams working on repair.'
    },
    {
      id: 4,
      title: 'Heatwave Alert - Govandi',
      type: 'heatwave',
      severity: 'critical',
      status: 'active',
      reporter_name: 'Anonymous',
      location_name: 'Govandi',
      latitude: 19.0235,
      longitude: 72.8974,
      created_at: new Date(Date.now() - 1 * 60000).toISOString(),
      description: 'Extreme heat conditions. Temperature crossing 42 degrees Celsius. Vulnerable population warned. Medical units on standby.'
    }
  ]);

  const [stats, setStats] = useState({
    total_active: 0,
    critical_count: 0,
    resolved_count: 0
  });

  useEffect(() => {
    updateStats();
  }, [incidents]);

  const updateStats = () => {
    const activeCount = incidents.filter(i => i.status !== 'resolved').length;
    const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
    
    setStats({
      total_active: activeCount,
      critical_count: criticalCount,
      resolved_count: resolvedCount
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  const handleStatusChange = (incidentId, newStatus) => {
    setIncidents(prev =>
      prev.map(i => i.id === incidentId ? { ...i, status: newStatus } : i)
    );
    setShowDetailModal(false);
    setSelectedIncident(null);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && incident.status !== 'resolved') ||
      (filterStatus === 'resolved' && incident.status === 'resolved');
    
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reporter_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/80 to-blue-900/60 border-b border-blue-500/30 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Incident Management System</h1>
              <p className="text-blue-300 text-sm">Real-time disaster monitoring and response coordination</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg font-semibold transition border border-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-lg font-bold text-white mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Active Incidents */}
            <div className="bg-gradient-to-br from-orange-950/40 to-orange-950/10 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <p className="text-orange-300 text-xs font-bold uppercase tracking-wide">Active Incidents</p>
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21m12-3h-2v-2h2v2m0-4h-2v-4h2v4"/>
                </svg>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-orange-400">{stats.total_active}</p>
                <p className="text-orange-300/60 text-xs">incidents</p>
              </div>
              <p className="text-orange-300/50 text-xs mt-3">Requires immediate attention</p>
            </div>

            {/* Critical Priority */}
            <div className="bg-gradient-to-br from-red-950/40 to-red-950/10 border border-red-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <p className="text-red-300 text-xs font-bold uppercase tracking-wide">Critical Priority</p>
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41"/>
                </svg>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-red-400">{stats.critical_count}</p>
                <p className="text-red-300/60 text-xs">high severity</p>
              </div>
              <p className="text-red-300/50 text-xs mt-3">Immediate action required</p>
            </div>

            {/* Resolved Today */}
            <div className="bg-gradient-to-br from-green-950/40 to-green-950/10 border border-green-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <p className="text-green-300 text-xs font-bold uppercase tracking-wide">Resolved</p>
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17"/>
                </svg>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-green-400">{stats.resolved_count}</p>
                <p className="text-green-300/60 text-xs">completed</p>
              </div>
              <p className="text-green-300/50 text-xs mt-3">Successfully handled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-white mb-6">Incident Alerts</h2>

        {/* Filter & Search Bar */}
        <div className="bg-gray-900/60 border border-blue-500/20 rounded-xl p-6 backdrop-blur mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-6">
              <input
                type="text"
                placeholder="Search incidents by title, location, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition placeholder-gray-500"
              />
            </div>

            {/* Status Filters */}
            <div className="lg:col-span-6 flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition flex-1 border ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-gray-800 text-gray-300 border-blue-500/30 hover:border-blue-500/50'
                }`}
              >
                All Alerts
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition flex-1 border ${
                  filterStatus === 'active'
                    ? 'bg-orange-600 text-white border-orange-400'
                    : 'bg-gray-800 text-gray-300 border-blue-500/30 hover:border-blue-500/50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition flex-1 border ${
                  filterStatus === 'resolved'
                    ? 'bg-green-600 text-white border-green-400'
                    : 'bg-gray-800 text-gray-300 border-blue-500/30 hover:border-blue-500/50'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">{filteredIncidents.length} incidents found</p>
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map(incident => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onSelectIncident={handleSelectIncident}
                isSelected={selectedIncident?.id === incident.id}
              />
            ))
          ) : (
            <div className="bg-gray-900/60 border border-blue-500/20 rounded-xl p-16 text-center backdrop-blur">
              <p className="text-gray-400 text-lg">No incidents match your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Incident Detail Modal */}
      {showDetailModal && selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}