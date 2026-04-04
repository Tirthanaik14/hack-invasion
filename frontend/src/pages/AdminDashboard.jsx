import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from '../utils/config'
import { timeAgo, severityColor } from '../utils/timeAgo'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    fetch(`${API_BASE_URL}/incidents`)
      .then(r => r.json())
      .then(data => {
        setIncidents(data.filter(i => i.status !== 'resolved'))
        setLoading(false)
      })

    const source = new EventSource(`${API_BASE_URL}/events/stream`)
    source.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data)
      if (eventType === 'incident_created') {
        setIncidents(prev => [data, ...prev])
      } else if (eventType === 'incident_updated' || eventType === 'incident_resolved') {
        setIncidents(prev => {
          if (data.status === 'resolved') return prev.filter(i => i.id !== data.id)
          return prev.map(i => i.id === data.id ? data : i)
        })
      }
    }
    return () => source.close()
  }, [navigate])

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('admin_token')
    try {
      const url = `${API_BASE_URL}/admin/incidents/${id}/${action}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error(`Action ${action} failed`)
    } catch (err) {
      console.error(err)
      alert('Action failed.')
    }
  }

  const triggerChaos = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      await fetch(`${API_BASE_URL}/admin/chaos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter">
      {/* Admin Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-sm font-black uppercase tracking-widest text-red-500">Command Center</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={triggerChaos}
            className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            ! Trigger Chaos
          </button>
          <button 
            onClick={logout}
            className="px-4 py-1.5 text-gray-500 hover:text-white border border-gray-800 rounded text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500 font-bold">Loading Subsystems...</div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold mb-6">Active Threats Queue</h2>
          
          <div className="grid gap-4">
            <AnimatePresence>
              {incidents.length === 0 ? (
                <div className="text-center py-10 text-gray-600 font-bold">No active threats detected.</div>
              ) : (
                incidents.map(inc => (
                  <motion.div
                    key={inc.id}
                    layout // Animates position shifts
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col md:flex-row bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden group"
                  >
                    <div className="w-1.5" style={{ background: severityColor(inc.severity, inc.status) }} />
                    
                    <div className="flex-1 p-5 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">{inc.title}</h3>
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">ID-{inc.id}</span>
                      </div>
                      
                      <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                        <span className="text-gray-300">📍 {inc.location_name}</span>
                        <span>{inc.type}</span>
                        <span>Severity: {inc.severity}</span>
                      </div>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-1 italic">
                        "{inc.description}"
                      </p>
                    </div>

                    <div className="bg-gray-900 md:border-l border-t md:border-t-0 border-gray-800 p-4 flex md:flex-col justify-center gap-2">
                      {inc.status === 'active' && (
                        <button
                          onClick={() => handleAction(inc.id, 'acknowledge')}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors whitespace-nowrap"
                        >
                          Verify Action
                        </button>
                      )}
                      {(inc.status === 'active' || inc.status === 'acknowledged') && (
                        <button
                          onClick={() => handleAction(inc.id, 'resolve')}
                          className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors whitespace-nowrap"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
