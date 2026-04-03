import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const LIVE_TICKER = [
  { type: 'flood',           text: 'Flash flood reported — Dharavi',         time: '2m ago',  color: '#3b82f6' },
  { type: 'fire',            text: 'Fire alert — Kurla Industrial Area',      time: '5m ago',  color: '#ef4444' },
  { type: 'heatwave',        text: 'Heatwave warning — Govandi',              time: '11m ago', color: '#f59e0b' },
  { type: 'infrastructure',  text: 'Power outage — Bandra West',              time: '18m ago', color: '#a855f7' },
  { type: 'flood',           text: 'Waterlogging — Andheri subway',           time: '24m ago', color: '#3b82f6' },
]

const STATS = [
  { value: '2.3M+', label: 'Citizens protected' },
  { value: '227',   label: 'Municipal wards covered' },
  { value: '<1s',   label: 'Alert delivery time' },
]

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    color: Math.random() > 0.6 ? '#3b82f6' : Math.random() > 0.5 ? '#ef4444' : '#f59e0b',
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function RadarPing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-500/20"
          initial={{ width: 100, height: 100, opacity: 0.6 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

function TickerRow({ inc, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: inc.color }} />
          <span className="text-gray-300 text-sm truncate">{inc.text}</span>
          <span className="text-gray-600 text-xs flex-shrink-0 ml-auto pl-4">{inc.time}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setTickerIndex(i => (i + 1) % LIVE_TICKER.length)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    // h-screen and overflow-hidden ensures no scrolling on desktop
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-between py-8 relative overflow-hidden">

      {/* background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f172a_0%,_#030712_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom_right,_rgba(59,130,246,0.04),_transparent_50%,_rgba(239,68,68,0.04))]" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <Particles />
      <RadarPing />

      {/* live incident ticker — Moved to top with relative position to stay in flex flow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="z-20 flex items-center gap-3 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-full px-4 py-2 min-w-80"
      >
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Live</span>
        </div>
        <div className="w-px h-3 bg-gray-700" />
        <div className="flex-1 overflow-hidden h-5 relative">
          {LIVE_TICKER.map((inc, i) => (
            <div key={i} className="absolute inset-0 flex items-center">
              <TickerRow inc={inc} isVisible={i === tickerIndex} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* main content — Condensed spacing */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-[10px] font-medium tracking-wide uppercase">Mumbai's Disaster Network</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black text-white mb-2 tracking-tight leading-none"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Resilience<span className="text-blue-400">Net</span>
        </motion.h1>

        <motion.p
          className="text-gray-400 text-base mb-1 font-light tracking-wide"
        >
          Real-time disaster awareness for Mumbai
        </motion.p>

        <motion.p
          className="text-gray-600 text-xs mb-8 max-w-md"
        >
          Community-powered incident reporting. Every second counts.
        </motion.p>

        {/* stat strip — Closer to text */}
        <motion.div
          className="flex gap-8 mb-8"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-bold text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>{s.value}</div>
              <div className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-tighter">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* portals — Slightly smaller padding */}
        <div className="flex gap-6">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => navigate('/home')}
            className="cursor-pointer relative bg-gray-900/80 backdrop-blur border border-blue-500/30 rounded-2xl p-6 w-56 flex flex-col items-center gap-2 hover:border-blue-400 transition-all duration-300 group"
          >
            <div className="text-4xl mb-1">🌐</div>
            <h2 className="text-white text-lg font-semibold">Public User</h2>
            <p className="text-gray-400 text-center text-xs leading-relaxed">View the live disaster map and report incidents</p>
            <div className="mt-1 flex items-center gap-1 text-blue-400 text-xs font-medium group-hover:gap-2 transition-all">
              View live map <span>→</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => navigate('/admin/login')}
            className="cursor-pointer relative bg-gray-900/80 backdrop-blur border border-red-500/30 rounded-2xl p-6 w-56 flex flex-col items-center gap-2 hover:border-red-400 transition-all duration-300 group"
          >
            <div className="text-4xl mb-1">🛡️</div>
            <h2 className="text-white text-lg font-semibold">Admin Portal</h2>
            <p className="text-gray-400 text-center text-xs leading-relaxed">Manage and resolve reported incidents</p>
            <div className="mt-1 flex items-center gap-1 text-red-400 text-xs font-medium group-hover:gap-2 transition-all">
              Restricted access <span>→</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* bottom tagline — Fixed spacing so it never overlaps */}
      <motion.p
        className="text-gray-700 text-[10px] z-10 tracking-[0.2em] uppercase"
      >
        Built for Mumbai · Community powered · Real-time
      </motion.p>

    </div>
  )
}   