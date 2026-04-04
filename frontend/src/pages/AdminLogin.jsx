import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '../utils/config'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [creds, setCreds] = useState({ username: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      })

      if (!response.ok) throw new Error('Invalid credentials')

      const data = await response.json()
      localStorage.setItem('admin_token', data.access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Access Denied. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden font-inter">
      {/* Red ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#450a0a_0%,_#030712_70%)] opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm z-10"
      >
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Defense Protocol</h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest mt-1">RESTRICTED AREA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Operator ID</label>
              <input
                type="text"
                required
                value={creds.username}
                onChange={e => setCreds({...creds, username: e.target.value})}
                className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-500">Passcode</label>
              <input
                type="password"
                required
                value={creds.password}
                onChange={e => setCreds({...creds, password: e.target.value})}
                className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {error && <div className="text-red-500 text-xs text-center font-bold">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-500 font-black text-white text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Initialize Override'}
            </button>
          </form>
          
          <button onClick={() => navigate('/')} className="w-full text-center mt-6 text-gray-600 hover:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-colors">
            ← Abort Sequence
          </button>
        </div>
      </motion.div>
    </div>
  )
}
