import React, { useEffect, useState, useContext } from 'react'
import { getWorkerDashboard } from '../utils/api'
import { getUser } from '../utils/auth'
import { Card, RiskBadge, RiskGauge, Spinner, Tag } from '../components/UI'
import { LangContext } from '../App'
import { t } from '../utils/i18n'

const STATUS_CONFIG = {
  ACTIVE:       { color: 'text-green-400', bg: 'bg-green-900/20 border-green-700/40', icon: '✓', label: 'Active' },
  PAYMENT_DUE:  { color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/40', icon: '⚠️', label: 'Payment Due' },
  GRACE_PERIOD: { color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-700/40', icon: '⏳', label: 'Grace Period' },
  FROZEN:       { color: 'text-red-400', bg: 'bg-red-950/30 border-red-700/50', icon: '🔒', label: 'Frozen' },
}

export default function WorkerDashboard() {
  const { lang } = useContext(LangContext)
  const user = getUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getWorkerDashboard(user.id).then(setData).finally(() => setLoading(false))
  }, [user?.id])

  if (loading) return <div className="pt-20"><Spinner /></div>
  if (!data) return <div className="pt-20 text-center text-text-dim">No data.</div>

  const { worker, current_risk, active_triggers, advisor, premium, zone_conditions, recent_claims, active_disruption_events } = data
  const status = STATUS_CONFIG[worker.payment_status] || STATUS_CONFIG.ACTIVE
  const advisorBg = {
    STOP: 'border-red-700/50 bg-red-950/30',
    CAUTION: 'border-orange-700/50 bg-orange-950/20',
    ADVISORY: 'border-yellow-700/50 bg-yellow-950/20',
    CLEAR: 'border-green-700/50 bg-green-950/20',
  }[advisor.badge] || 'border-border'

  return (
    <div className="pt-20 pb-12 px-4 max-w-2xl mx-auto fade-in">

      {/* Freeze warning */}
      {worker.payment_status === 'FROZEN' && (
        <div className="mb-4 bg-red-950/40 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm">
          🔒 {t(lang, 'frozenWarning')}
        </div>
      )}
      {worker.payment_status === 'GRACE_PERIOD' && (
        <div className="mb-4 bg-orange-950/30 border border-orange-700/40 rounded-xl p-4 text-orange-300 text-sm">
          ⏳ {t(lang, 'graceWarning')} Grace deadline: {worker.grace_deadline}
        </div>
      )}
      {worker.payment_status === 'PAYMENT_DUE' && (
        <div className="mb-4 bg-yellow-950/20 border border-yellow-700/40 rounded-xl p-4 text-yellow-300 text-sm">
          ⚠️ {t(lang, 'dueWarning')} Due: {worker.payment_due_date}
        </div>
      )}

      {/* Hero */}
      <Card className="mb-4" glow={current_risk.level === 'HIGH'}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-text-dim text-xs font-mono mb-1">{t(lang, 'goodMorning').toUpperCase()}</div>
            <div className="font-display font-bold text-2xl text-text">{worker.name}</div>
            <div className="text-text-dim text-sm mt-0.5">
              📍 {worker.zone}, {worker.city}
              <span className={`ml-2 text-xs font-mono ${worker.is_metro ? 'text-blue-400' : 'text-gray-500'}`}>
                {worker.is_metro ? '🏙 Metro' : '🌄 Non-Metro'}
              </span>
            </div>
            <div className="text-text-dim text-xs mt-1 font-mono">
              🕐 Shift: {worker.shift_start} – {worker.shift_end} &nbsp;|&nbsp; ₹{worker.daily_income}/day
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <RiskBadge level={current_risk.level} size="md" />
            <span className={`text-xs font-mono border rounded px-2 py-0.5 ${status.bg} ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <RiskGauge score={current_risk.score} />
          <div className="flex-1 ml-6">
            <div className="text-text-dim text-xs font-mono mb-2">{t(lang, 'activeConditions').toUpperCase()}</div>
            {active_triggers.length === 0 ? (
              <div className="text-green-400 text-sm">✓ {t(lang, 'allClear')}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {active_triggers.map((tr, i) => (
                  <span key={i} className="text-sm bg-border rounded-lg px-2.5 py-1">{tr.icon} {tr.label}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Work Advisor */}
      <Card className={`mb-4 border ${advisorBg}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧭</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-semibold text-text">{t(lang, 'workAdvisor')}</span>
              <Tag color={advisor.color === 'red' ? 'red' : advisor.color === 'orange' ? 'orange' : advisor.color === 'yellow' ? 'yellow' : 'green'}>
                {advisor.badge}
              </Tag>
            </div>
            <div className="text-accent font-semibold mb-1">{advisor.window}</div>
            <div className="text-text-dim text-sm">{advisor.reason}</div>
          </div>
        </div>
      </Card>

      {/* Active Disruptions */}
      {active_disruption_events?.length > 0 && (
        <Card className="mb-4 border border-orange-700/40 bg-orange-950/10">
          <div className="text-text-dim text-xs font-mono mb-3">⚡ ACTIVE DISRUPTIONS IN YOUR ZONE</div>
          {active_disruption_events.map(ev => (
            <div key={ev.id} className="flex items-start justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-text text-sm font-medium capitalize">{ev.event_type} — {ev.description}</div>
                <div className="text-text-dim text-xs mt-0.5">
                  {ev.event_start} – {ev.event_end} &nbsp;|&nbsp; Factor: {ev.disruption_factor}
                </div>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                {ev.overlap_hours > 0 ? (
                  <div>
                    <div className="text-accent font-mono font-bold text-sm">
                      ₹{(data.worker.daily_income * ev.disruption_factor * (ev.overlap_hours / worker.working_hours)).toFixed(0)}
                    </div>
                    <div className="text-green-400 text-xs">{ev.overlap_hours}h overlap</div>
                  </div>
                ) : (
                  <div className="text-text-dim text-xs">No shift overlap</div>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Zone conditions */}
      {zone_conditions && Object.keys(zone_conditions).length > 0 && (
        <Card className="mb-4">
          <div className="text-text-dim text-xs font-mono mb-3">{t(lang, 'zoneCond').toUpperCase()} — {worker.zone.toUpperCase()}</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rain', value: `${zone_conditions.rain}mm`, icon: '🌧' },
              { label: 'Temp', value: `${zone_conditions.temperature}°C`, icon: '🌡' },
              { label: 'AQI', value: zone_conditions.aqi, icon: '💨' },
              { label: 'Traffic', value: `${zone_conditions.traffic_level}/5`, icon: '🚦' },
              { label: 'Curfew', value: zone_conditions.curfew ? 'YES' : 'No', icon: '🚫' },
              { label: 'Income/day', value: `₹${worker.daily_income}`, icon: '💰' },
            ].map(c => (
              <div key={c.label} className="bg-surface rounded-lg p-3 text-center">
                <div className="text-lg mb-0.5">{c.icon}</div>
                <div className="font-mono text-sm text-text font-medium">{c.value}</div>
                <div className="text-text-dim text-xs">{c.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Premium summary */}
      <Card className="mb-4">
        <div className="text-text-dim text-xs font-mono mb-3">{t(lang, 'yourPlan').toUpperCase()}</div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RiskBadge level={premium.tier} />
              <span className="font-display font-bold text-xl text-text">₹{premium.weekly_premium}/week</span>
            </div>
            <div className="text-text-dim text-xs">7-day avg zone risk: {premium.avg_risk_7d?.toFixed(1)}</div>
          </div>
          <div className="text-4xl">🛡</div>
        </div>
        {/* Breakdown */}
        <div className="bg-surface rounded-lg p-3 mt-2">
          <div className="text-text-dim text-xs font-mono mb-2">{t(lang, 'premiumBreakdown').toUpperCase()}</div>
          <div className="flex flex-col gap-1.5 text-xs font-mono">
            <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'basePremium')} ({premium.base_tier})</span><span className="text-text">₹{premium.base}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'metroBonus')}</span><span className={premium.metro_multiplier > 1 ? 'text-yellow-400' : 'text-text-dim'}>×{premium.metro_multiplier} {worker.is_metro ? '(+15%)' : ''}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'safetyBonus')}</span><span className={premium.safety_multiplier < 1 ? 'text-green-400' : premium.safety_multiplier > 1 ? 'text-red-400' : 'text-text-dim'}>×{premium.safety_multiplier}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'shiftBonus')}</span><span className={premium.night_shift ? 'text-orange-400' : 'text-text-dim'}>×{premium.shift_multiplier} {premium.night_shift ? '(Night)' : ''}</span></div>
            <div className="border-t border-border my-1" />
            <div className="flex justify-between font-bold"><span className="text-accent">{t(lang, 'final')}</span><span className="text-accent">₹{premium.weekly_premium}</span></div>
          </div>
        </div>
      </Card>

      {/* Recent claims */}
      {recent_claims.length > 0 && (
        <Card>
          <div className="text-text-dim text-xs font-mono mb-3">{t(lang, 'recentClaims').toUpperCase()}</div>
          <div className="flex flex-col gap-2">
            {recent_claims.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-text text-sm font-medium">{c.event}</div>
                  <div className="text-text-dim text-xs">{c.date} {c.overlap_hours > 0 && `· ${c.overlap_hours}h overlap`}</div>
                </div>
                <div className="text-right">
                  <div className="text-accent font-mono font-medium">₹{c.payout}</div>
                  <Tag color={c.status === 'approved' ? 'green' : c.status === 'not_eligible' ? 'gray' : 'red'}>{c.status}</Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
