export function DisasterVisual({ type, size = 'medium' }) {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const disasterConfigs = {
    flood: {
      bg: 'bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400',
      pattern: 'relative overflow-hidden',
      icon: (
        <svg className="w-full h-full p-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="water" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q5,5 10,10 T20,10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            </pattern>
          </defs>
          <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <path d="M20,50 Q30,40 40,50 T60,50 T80,50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <path d="M20,60 Q30,50 40,60 T60,60 T80,60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <path d="M20,70 Q30,60 40,70 T60,70 T80,70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
        </svg>
      )
    },
    fire: {
      bg: 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400',
      pattern: 'relative overflow-hidden',
      icon: (
        <svg className="w-full h-full p-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="flame" cx="50%" cy="50%">
              <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.8)', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: 'rgba(255,100,0,0.3)', stopOpacity: 1}} />
            </radialGradient>
          </defs>
          <path d="M50,20 Q40,40 45,60 Q50,75 50,85 Q50,75 55,60 Q60,40 50,20" fill="rgba(255,255,255,0.4)" stroke="rgba(255,200,0,0.6)" strokeWidth="1.5"/>
          <path d="M50,35 Q45,50 48,65 Q50,70 50,75 Q50,70 52,65 Q55,50 50,35" fill="rgba(255,255,255,0.6)"/>
          <circle cx="50" cy="50" r="15" fill="rgba(255,200,0,0.3)"/>
        </svg>
      )
    },
    heatwave: {
      bg: 'bg-gradient-to-br from-yellow-500 via-red-500 to-orange-600',
      pattern: 'relative overflow-hidden',
      icon: (
        <svg className="w-full h-full p-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <path d="M20,70 Q20,50 40,40"/>
            <path d="M50,75 Q50,45 70,30"/>
            <path d="M80,70 Q80,50 60,40"/>
          </g>
          <g fill="rgba(255,255,255,0.4)">
            <circle cx="25" cy="35" r="4"/>
            <circle cx="50" cy="20" r="5"/>
            <circle cx="75" cy="35" r="4"/>
          </g>
          <path d="M20,85 L80,85" stroke="rgba(255,200,0,0.7)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    },
    infrastructure: {
      bg: 'bg-gradient-to-br from-gray-600 via-gray-500 to-slate-700',
      pattern: 'relative overflow-hidden',
      icon: (
        <svg className="w-full h-full p-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
            <rect x="15" y="30" width="20" height="50"/>
            <rect x="42" y="20" width="16" height="60"/>
            <rect x="65" y="35" width="20" height="45"/>
            <line x1="25" y1="45" x2="35" y2="45"/>
            <line x1="25" y1="60" x2="35" y2="60"/>
            <line x1="25" y1="75" x2="35" y2="75"/>
            <line x1="50" y1="35" x2="58" y2="35"/>
            <line x1="50" y1="50" x2="58" y2="50"/>
            <line x1="50" y1="65" x2="58" y2="65"/>
            <line x1="75" y1="50" x2="85" y2="50"/>
            <line x1="75" y1="65" x2="85" y2="65"/>
          </g>
          <line x1="10" y1="85" x2="90" y2="85" stroke="rgba(255,100,100,0.6)" strokeWidth="2"/>
        </svg>
      )
    },
    other: {
      bg: 'bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700',
      pattern: 'relative overflow-hidden',
      icon: (
        <svg className="w-full h-full p-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="40" r="12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <path d="M50,52 L35,80 L65,80 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <line x1="50" y1="40" x2="35" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <line x1="50" y1="40" x2="65" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.5)"/>
        </svg>
      )
    }
  };

  const config = disasterConfigs[type] || disasterConfigs.other;

  return (
    <div className={`${sizes[size]} ${config.bg} rounded-lg flex items-center justify-center shadow-lg`}>
      {config.icon}
    </div>
  );
}