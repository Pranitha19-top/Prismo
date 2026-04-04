import React, { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LangContext } from '../App'
import { getUser } from '../utils/auth'
import { t } from '../utils/i18n'

const workerLinks = [
  { to: '/worker', label: 'dashboard', icon: '⚡' },
  { to: '/worker/map', label: 'riskMap', icon: '🗺' },
  { to: '/worker/policy', label: 'policy', icon: '🛡' },
  { to: '/worker/claims', label: 'claims', icon: '📋' },
  { to: '/worker/payment', label: 'payment', icon: '💳' },
]

const adminLinks = [
  { to: '/admin', label: 'overview', icon: '📊' },
  { to: '/admin/zones', label: 'zoneAnalytics', icon: '🏙' },
]

export default function Navbar({ onLogout }) {
  const { lang, setLang } = useContext(LangContext)
  const user = getUser()
  const isAdmin = user?.role === 'admin'
  const links = isAdmin ? adminLinks : workerLinks

  const statusColors = {
    ACTIVE: 'text-green-400',
    PAYMENT_DUE: 'text-yellow-400',
    GRACE_PERIOD: 'text-orange-400',
    FROZEN: 'text-red-400',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-display font-bold text-lg text-text tracking-tight">PRISMO</span>
          <span className="text-text-dim text-xs font-mono ml-1 hidden sm:block">
            {isAdmin ? '/ ops' : '/ worker'}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/worker' || link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-text-dim hover:text-text hover:bg-border'
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span className="hidden sm:block">{t(lang, link.label)}</span>
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="text-xs font-mono px-2.5 py-1.5 border border-border rounded-lg text-text-dim hover:text-text hover:border-accent/50 transition-colors"
            title="Toggle language"
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* Payment status badge */}
          {!isAdmin && user?.payment_status && user.payment_status !== 'ACTIVE' && (
            <span className={`text-xs font-mono hidden sm:block ${statusColors[user.payment_status] || 'text-gray-400'}`}>
              {user.payment_status === 'FROZEN' ? '🔒' : '⚠️'} {user.payment_status.replace('_', ' ')}
            </span>
          )}

          {/* User name */}
          <span className="text-xs text-text-dim hidden md:block">
            {user?.name?.split(' ')[0]}
          </span>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-xs font-mono px-3 py-1.5 border border-border rounded-lg text-text-dim hover:text-text hover:border-red-500/50 hover:text-red-400 transition-colors"
          >
            {t(lang, 'logout')}
          </button>
        </div>
      </div>
    </nav>
  )
}
