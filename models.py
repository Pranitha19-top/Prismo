import React from 'react'

export function RiskBadge({ level, size = 'sm' }) {
  const colors = {
    LOW: 'bg-green-900/40 text-green-400 border-green-700/50',
    MEDIUM: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
    HIGH: 'bg-red-900/40 text-red-400 border-red-700/50',
    CRITICAL: 'bg-red-950 text-red-300 border-red-600',
  }
  const sizes = { xs: 'px-2 py-0.5 text-xs', sm: 'px-3 py-1 text-xs', md: 'px-4 py-1.5 text-sm' }
  const cls = colors[level] || colors.LOW
  return (
    <span className={`border rounded-full font-mono font-medium tracking-wider ${cls} ${sizes[size]}`}>
      {level}
    </span>
  )
}

export function Card({ children, className = '', glow = false }) {
  return (
    <div className={`bg-panel border border-border rounded-xl p-5 card-hover ${glow ? 'shadow-glow' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function KPICard({ label, value, sub, icon, color = 'text-accent' }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <span className="text-text-dim text-xs font-mono uppercase tracking-widest">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-display font-bold ${color}`}>{value}</div>
      {sub && <div className="text-text-dim text-xs">{sub}</div>}
    </Card>
  )
}

export function SeverityDot({ severity }) {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[severity] || 'bg-gray-500'}`} />
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function Tag({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-green-900/30 text-green-400',
    yellow: 'bg-yellow-900/30 text-yellow-400',
    red: 'bg-red-900/30 text-red-400',
    orange: 'bg-orange-900/30 text-orange-400',
    gray: 'bg-gray-800 text-gray-400',
    blue: 'bg-blue-900/30 text-blue-400',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-mono ${colors[color]}`}>{children}</span>
  )
}

export function RiskGauge({ score }) {
  const angle = (score / 100) * 180 - 90
  const color = score < 35 ? '#22c55e' : score < 65 ? '#eab308' : '#ef4444'
  return (
    <div className="relative flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 70">
        {/* Track */}
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#1e2330" strokeWidth="8" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 157} 157`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle}, 60, 65)`}>
          <line x1="60" y1="65" x2="60" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="65" r="4" fill={color} />
        </g>
      </svg>
      <div className="font-display font-bold text-2xl" style={{ color }}>{score}</div>
      <div className="text-text-dim text-xs">/ 100</div>
    </div>
  )
}
