import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { timeAgo, severityColor } from '../utils/timeAgo'

import { API_BASE_URL } from '../utils/config'

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inc, setInc] = useState(null)
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE_URL}/incidents/${id}`)
      .then(res => res.json())
      .then(data => setInc(data))
      .catch(err => console.error(err))
      
    // Real-time listener for just this incident
    const source = new EventSource(`${API_BASE_URL}/events/stream`)
    source.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data)
      if ((eventType === 'incident_updated' || eventType === 'incident_resolved') && String(data.id) === String(id)) {
        setInc(data)
      }
    }
    return () => source.close()
  }, [id])

  useEffect(() => {
    if (!inc) return
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(inc.created_at)) / 1000)
      setSecondsElapsed(diff)
    }, 1000)
    return () => clearInterval(interval)
  }, [inc])

  const shareOnWhatsApp = () => {
    const text = `🚨 *ResilienceNet Alert* 🚨\n\nIncident: ${inc.title}\nLocation: ${inc.location_name}\nSeverity: ${inc.severity.toUpperCase()}\n\nStay safe! View on map: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const speakIncident = () => {
    const speech = new SpeechSynthesisUtterance(`${inc.title} reported at ${inc.location_name}. Severity level is ${inc.severity}. ${inc.description}`)
    window.speechSynthesis.speak(speech)
  }

  if (!inc) return <div className="h-screen bg-gray-950 flex items-center justify-center text-gray-500">Incident Not Found</div>

  const isGoldenHour = secondsElapsed < 3600

  return (
    // FIXED: h-screen and overflow-hidden removes page-level scrolling
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden font-inter">
      <Navbar />
      
      {/* Centered Container with inner scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col items-center">
        <div className="w-full max-w-xl">
          {/* Compact Back Button */}
          <button onClick={() => navigate('/home')} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            ← Back to Map
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl"
          >
            <div className="h-1.5 w-full" style={{ background: severityColor(inc.severity, inc.status) }} />
            
            <div className="p-6">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0">
                  <h1 className="text-2xl font-black mb-1 tracking-tight truncate">{inc.title}</h1>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">📍 {inc.location_name}</p>
                </div>
                
                {/* Compact Timer */}
                <div className={`px-3 py-1.5 rounded-lg border text-center ${isGoldenHour ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5'}`}>
                  <p className="text-[8px] font-black uppercase tracking-tighter opacity-60">Elapsed</p>
                  <p className="font-mono text-xs font-bold">{Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s</p>
                </div>
              </div>

              {/* Tighter Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button onClick={shareOnWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95">
                  Share Alert
                </button>
                <button onClick={speakIncident} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95">
                  🔊 Audio Log
                </button>
              </div>

              {/* Status Timeline - Smaller */}
              <div className="mb-6">
                <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-xl">
                  <div className="relative flex items-center justify-between px-6">
                    <div className="absolute left-0 right-0 h-0.5 bg-gray-800 z-0 mx-10" />
                    {[
                      { key: 'active', label: 'Report' },
                      { key: 'acknowledged', label: 'Verify' },
                      { key: 'resolved', label: 'Done' }
                    ].map((step, idx) => {
                      const isPast = (inc.status === 'resolved') || (inc.status === 'acknowledged' && idx <= 1) || (inc.status === 'active' && idx === 0);
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 border-gray-900 ${isPast ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`} />
                          <span className={`text-[8px] mt-1.5 font-black uppercase tracking-tighter ${isPast ? 'text-blue-400' : 'text-gray-600'}`}>{step.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Content Brief - Scrollable if needed */}
              <div className="max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                <h3 className="text-[9px] uppercase text-gray-600 font-black tracking-[0.2em] mb-2">Description</h3>
                <p className="text-gray-300 leading-snug text-sm font-medium italic">
                  "{inc.description || "Field verification pending. Initial report indicates local disturbance. Emergency units notified."}"
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-800/50 flex justify-between items-center text-[9px] font-black text-gray-600 uppercase tracking-widest">
                <span>By: <span className="text-gray-400">{inc.reporter_name}</span></span>
                <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-500">INC-{inc.id}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
