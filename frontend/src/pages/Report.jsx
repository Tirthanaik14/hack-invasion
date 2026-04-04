import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { API_BASE_URL } from '../utils/config'

const TYPES = ['flood', 'heatwave', 'fire', 'infrastructure', 'other']
const SEVERITIES = ['low', 'warning', 'critical']

export default function Report() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    type: 'flood',
    severity: 'warning',
    location_name: '',
    latitude: null,
    longitude: null,
    reporter_name: '',
    description: '',
  })

  useEffect(() => {
    // Try to auto-grab location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }))
          // Optionally save userArea for 'My Area' filter
          localStorage.setItem('userArea', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
        },
        (err) => setLocationError('Please enable location access for accurate reporting.')
      )
    } else {
      setLocationError('Geolocation is not supported by your browser.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Submission failed')

      setSuccess(true)
      setTimeout(() => navigate('/home'), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to sumbit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow based on severity */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            formData.severity === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
            formData.severity === 'warning' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
            'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
          }`} />

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black mb-1 uppercase tracking-tight">Report Incident</h1>
            <p className="text-gray-400 text-xs">Help Mumbai by providing accurate ground intelligence.</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                <span className="text-green-500 text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-bold text-green-400 mb-2">Report Submitted</h2>
              <p className="text-gray-400 text-sm">Your intelligence has been merged into the central grid. Authorities are notified.</p>
              <p className="text-gray-600 text-[10px] mt-4 uppercase">Redirecting to live map...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Incident Title</label>
                  <input required placeholder="e.g. Broken water pipe" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none">
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Severity</label>
                  <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none">
                    {SEVERITIES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Location Details</label>
                <div className="flex gap-2">
                  <input required placeholder="e.g. Bandra Kurla Complex" value={formData.location_name} onChange={e => setFormData({...formData, location_name: e.target.value})} className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                {locationError && <p className="text-red-400 text-[10px] mt-1">{locationError}</p>}
                {formData.latitude && <p className="text-blue-400 text-[10px] mt-1">📍 GPS Coordinates Acquired</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Description</label>
                <textarea required rows={3} placeholder="Provide critical details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>

              <div className="space-y-1 mb-8">
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Your Name (Optional)</label>
                <input placeholder="Anonymous" value={formData.reporter_name} onChange={e => setFormData({...formData, reporter_name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Transmit Alert'}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  )
}
