import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Map', path: '/home' },
    { label: 'Report', path: '/report' },
    { label: 'Alerts', path: '/alerts' },
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
        <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium">
          3 active
        </span>
        <span className="text-gray-500 text-sm">Mumbai</span>
      </div>
    </nav>
  )
}