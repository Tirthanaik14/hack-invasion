import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Map', path: '/home' },
    { label: 'Report', path: '/report' },
    { label: 'Alerts', path: '/alerts' },
    { label: 'Admin (C2)', path: '/admin/login' },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
      <span
        onClick={() => navigate('/')}
        className="text-white font-black text-xl tracking-tighter cursor-pointer"
      >
        Resilience<span className="text-blue-400">Net</span>
      </span>
      <div className="flex gap-2 ml-4">
        {links.map(l => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname === l.path
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          SYSTEM LIVE
        </span>
        <span className="text-gray-500 text-sm">Mumbai Operations Grid</span>
      </div>
    </nav>
  )
}