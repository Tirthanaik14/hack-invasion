import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { timeAgo, severityColor } from '../utils/timeAgo'

import { API_BASE_URL } from '../utils/config'

function SeverityBadge({ severity, status }) {
  if (status === 'resolved') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-500/20 text-green-400">Resolved</span>
  if (severity === 'critical') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-500/20 text-red-400">Critical</span>
  if (severity === 'warning') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-500/20 text-amber-400">Warning</span>
  return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">Low</span>
}
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const TABS = ['All Alerts', 'My Area', 'Resolved']
const TYPES = ['All Types', 'flood', 'heatwave', 'fire', 'infrastructure', 'other']
const SEVERITIES = ['All Severities', 'critical', 'warning', 'low']

export default function Alerts() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [activeTab, setActiveTab] = useState('All Alerts')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [severityFilter, setSeverityFilter] = useState('All Severities')
  const userArea = JSON.parse(localStorage.getItem('userArea') || 'null')

  useEffect(() => {
    fetch(`${API_BASE_URL}/incidents`)
      .then(r => r.json())
      .then(setIncidents)
      .catch(e => console.error(e))

    // Real-time listener
    const source = new EventSource(`${API_BASE_URL}/events/stream`)
    source.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data)
      if (eventType === 'incident_created') {
        setIncidents(prev => [data, ...prev])
      } else if (eventType === 'incident_updated' || eventType === 'incident_resolved') {
        setIncidents(prev => prev.map(i => i.id === data.id ? data : i))
      }
    }
    return () => source.close()
  }, [])

  const filtered = incidents
    .filter(inc => {
      if (activeTab === 'Resolved') return inc.status === 'resolved'
      if (activeTab === 'My Area') {
        if (!userArea) return false
        return haversineKm(userArea.lat, userArea.lng, inc.latitude, inc.longitude) <= 5
      }
      return inc.status !== 'resolved'
    })
    .filter(inc => inc.title.toLowerCase().includes(search.toLowerCase()))
    .filter(inc => typeFilter === 'All Types' || inc.type === typeFilter)
    .filter(inc => severityFilter === 'All Severities' || inc.severity === severityFilter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex-1">

        {/* header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white">Incident Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">All reported incidents across Mumbai</p>
        </motion.div>

        {/* tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-4 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 flex-1 min-w-48"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* My Area notice */}
        {activeTab === 'My Area' && !userArea && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-4 text-amber-400 text-sm">
            No area saved. Your location will be set automatically when you submit a report.
          </div>
        )}

        {/* count */}
        <p className="text-gray-500 text-xs mb-3">{filtered.length} incident{filtered.length !== 1 ? 's' : ''} found</p>

        {/* list */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-500"
              >
                <p className="text-lg">No incidents found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </motion.div>
            ) : (
              filtered.map((inc, i) => (
                <motion.div
  key={inc.id}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.04 }}
  onClick={() => navigate(`/incidents/${inc.id}`)}
  className="relative bg-gray-900/50 border border-gray-800 px-5 py-3 rounded-xl flex items-center gap-4 cursor-pointer hover:border-blue-500/40 hover:bg-gray-800/40 transition-all group overflow-hidden"
>
  {/* Side Accent Line */}
  <div 
    className="absolute left-0 top-0 bottom-0 w-1 opacity-60" 
    style={{ background: severityColor(inc.severity, inc.status) }} 
  />

  {/* Status & Indicators */}
  <div className="relative flex-shrink-0 flex items-center justify-center w-6">
    <div 
      className="w-2.5 h-2.5 rounded-full" 
      style={{ background: severityColor(inc.severity, inc.status) }} 
    />
    {inc.severity === 'critical' && inc.status !== 'resolved' && (
      <div 
        className="absolute inset-0 rounded-full animate-ping opacity-40" 
        style={{ background: severityColor(inc.severity, inc.status) }} 
      />
    )}
  </div>

  {/* Main Text Content */}
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
        {inc.title}
      </h2>
      
      {/* Golden Hour Icon (if < 60 mins) */}
      {(Date.now() - new Date(inc.created_at)) < 3600000 && inc.status !== 'resolved' && (
        <span className="flex items-center gap-1 text-[9px] font-black text-red-400 animate-pulse bg-red-500/10 px-1.5 py-0.5 rounded">
          ⏱ GOLDEN HOUR
        </span>
      )}
    </div>

    <div className="flex gap-4 text-[10px] text-gray-500 mt-0.5 font-medium uppercase tracking-wider">
      <span className="flex items-center gap-1">🕒 {timeAgo(inc.created_at)}</span>
      <span className="flex items-center gap-1 truncate">📍 {inc.location_name}</span>
      <span className="hidden md:inline">👤 {inc.reporter_name}</span>
    </div>
  </div>

  {/* Badges Section */}
  <div className="flex items-center gap-3 flex-shrink-0">
    {/* Unverified Flag (>24h active) */}
    {Date.now() - new Date(inc.created_at) > 86400000 && inc.status === 'active' && (
      <div className="hidden sm:block px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[9px] font-black text-gray-400 tracking-tighter">
        UNVERIFIED
      </div>
    )}
    
    <div className="scale-90 origin-right">
      <SeverityBadge severity={inc.severity} status={inc.status} />
    </div>
    
    <span className="text-gray-700 group-hover:text-blue-500 transition-colors">→</span>
  </div>
</motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}