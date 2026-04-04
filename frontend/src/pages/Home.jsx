import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, LayerGroup, ZoomControl } from 'react-leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'
import { timeAgo, severityColor } from '../utils/timeAgo'
import { API_BASE_URL } from '../utils/config'

export default function Home() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [showEmergency, setShowEmergency] = useState(false)
  const [emergencyNodes, setEmergencyNodes] = useState([])
  const [stats, setStats] = useState({ critical: 0, active: 0, total_today: 0, resolved: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetch(`${API_BASE_URL}/incidents`)
      .then(res => res.json())
      .then(data => {
        setIncidents(data.incidents)
        updateStats(data.incidents)
        setTimeout(() => setIsLoading(false), 800) // Small delay for effect
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })

    // SSE Real-Time Updates Setup
    const source = new EventSource(`${API_BASE_URL}/events/stream`)
    source.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data)
      
      if (eventType === 'incident_created') {
        setIncidents(prev => {
          const newIncidents = [data, ...prev]
          updateStats(newIncidents)
          return newIncidents
        })
      } else if (eventType === 'incident_updated' || eventType === 'incident_resolved') {
        setIncidents(prev => {
          const newIncidents = prev.map(i => i.id === data.id ? data : i)
          updateStats(newIncidents)
          return newIncidents
        })
      }
    }

    return () => {
      source.close()
    }
  }, [])

  const updateStats = (data) => {
    const today = new Date().toISOString().split('T')[0]
    setStats({
      critical: data.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
      active: data.filter(i => i.status === 'active').length,
      total_today: data.filter(i => i.created_at.startsWith(today)).length,
      resolved: data.filter(i => i.status === 'resolved').length
    })
  }

  // Logic to detect multiple incidents in one area
  const isHighVelocity = (loc) => incidents.filter(i => i.location_name === loc).length >= 2

  useEffect(() => {
    if (showEmergency && emergencyNodes.length === 0) {
      const query = `[out:json];(node["amenity"="hospital"](18.9,72.7,19.2,73.0);node["amenity"="fire_station"](18.9,72.7,19.2,73.0););out;`;
      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => setEmergencyNodes(data.elements))
    }
  }, [showEmergency, emergencyNodes.length])

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <Navbar />

      <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        {[
          { label: 'Critical', value: stats.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Active', value: stats.active, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Reported Today', value: stats.total_today, color: 'text-white', bg: 'bg-gray-800' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-lg py-2 text-center border border-gray-800/50`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-tighter">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-[2000] bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-blue-400 font-bold text-xs tracking-[0.2em] uppercase animate-pulse">Syncing Map Grid...</p>
          </div>
        )}
        <div className="relative flex-1">
          <MapContainer center={[19.0760, 72.8777]} zoom={12} zoomControl={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="topleft" />
            
            {incidents.map(inc => (
              <LayerGroup key={inc.id}>
                {/* Visual Area of Effect for Critical Incidents (approx 500m radius) */}
                {inc.severity === 'critical' && inc.status !== 'resolved' && (
                  <Circle 
                    center={[inc.latitude, inc.longitude]} 
                    radius={800} 
                    pathOptions={{ color: '#ef4444', weight: 1, fillColor: '#ef4444', fillOpacity: 0.15 }}
                  />
                )}

                {/* 1. RESTORED: Pulsing Velocity Ring */}
                {isHighVelocity(inc.location_name) && inc.status !== 'resolved' && (
                  <CircleMarker 
                    center={[inc.latitude, inc.longitude]} 
                    radius={25} 
                    pathOptions={{ color: severityColor(inc.severity, inc.status), weight: 1, fillOpacity: 0.1 }}
                    className="animate-pulse" // This creates the "ring" effect
                  />
                )}

                {/* 2. RESTORED: Main Incident Dot with Popup */}
                <CircleMarker
                  center={[inc.latitude, inc.longitude]}
                  radius={inc.severity === 'critical' ? 12 : 8}
                  pathOptions={{
                    color: severityColor(inc.severity, inc.status),
                    fillColor: severityColor(inc.severity, inc.status),
                    fillOpacity: 0.8,
                  }}
                >
                  <Popup>
                    <div className="text-gray-900 min-w-[150px]">
                      <p className="font-bold text-sm leading-tight">{inc.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{inc.location_name}</p>
                      <div className="h-px bg-gray-200 my-2" />
                      <p className="text-[10px]"><strong>Reporter:</strong> {inc.reporter_name}</p>
                      <p className="text-[10px] text-blue-600 font-bold mt-2 cursor-pointer" onClick={() => navigate(`/incidents/${inc.id}`)}>
                        VIEW FULL ANALYSIS →
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              </LayerGroup>
            ))}

            {showEmergency && emergencyNodes.map(node => (
              <CircleMarker 
                key={node.id} 
                center={[node.lat, node.lon]} 
                radius={5} 
                pathOptions={{ color: '#fff', fillColor: '#3b82f6', fillOpacity: 1 }}
              >
                <Popup><span className="text-xs font-bold">{node.tags.name || 'Emergency Center'}</span></Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          <div className="absolute bottom-4 right-4 z-[1000]">
            <button 
              onClick={() => setShowEmergency(!showEmergency)}
              className={`px-4 py-2 rounded-lg border text-[10px] font-bold transition-all shadow-2xl backdrop-blur-md ${showEmergency ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-900/90 border-gray-700 text-gray-400'}`}
            >
              {showEmergency ? '📡 EMERGENCY SERVICES ACTIVE' : '📡 SHOW EMERGENCY SERVICES'}
            </button>
          </div>

          <button
            onClick={() => navigate('/report')}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-black text-xs shadow-2xl uppercase tracking-widest transition-transform hover:scale-105"
          >
            + Report Incident
          </button>
        </div>

        <div className="w-72 bg-gray-950 border-l border-gray-800 flex flex-col flex-shrink-0">
          <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/30">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Alert Feed</h2>
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-black text-green-400 uppercase">Live</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {incidents.map((inc, i) => (
              <div
                key={inc.id}
                className="px-4 py-4 border-b border-gray-900 hover:bg-gray-900/50 cursor-pointer group"
                onClick={() => navigate(`/incidents/${inc.id}`)}
              >
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: severityColor(inc.severity, inc.status) }} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 truncate">{inc.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">{inc.type} • {timeAgo(inc.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-900/50">
            <button
              onClick={() => navigate('/alerts')}
              className="w-full py-2.5 rounded-lg border border-gray-800 text-[10px] font-bold text-blue-400 hover:bg-gray-800 uppercase tracking-widest"
            >
              Explore All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}