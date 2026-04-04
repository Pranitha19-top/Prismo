import React, { useEffect, useState, useContext } from 'react'
import { getDisruptionEvents, getClaims, triggerClaim, getWorkerDashboard } from '../utils/api'
import { getUser } from '../utils/auth'
import { Card, Spinner, Tag, RiskBadge } from '../components/UI'
import { LangContext } from '../App'
import { t } from '../utils/i18n'

export default function ClaimsPage() {
  const { lang } = useContext(LangContext)
  const user = getUser()
  const [events, setEvents] = useState([])
  const [claims, setClaims] = useState([])
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filing, setFiling] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const reload = () => {
    if (!user) return
    setLoading(true)
    Promise.all([
      getDisruptionEvents(user.zone || ''),
      getClaims(user.id),
      getWorkerDashboard(user.id),
    ]).then(([evs, cls, dash]) => {
      setEvents(evs)
      setClaims(cls)
      setDashData(dash)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [user?.id])

  const handleFile = async (eventId) => {
    setError(''); setResult(null); setFiling(eventId)
    try {
      const res = await triggerClaim({ event_id: eventId })
      setResult(res)
      reload()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to file claim')
    } finally { setFiling(null) }
  }

  if (loading) return <div className="pt-20"><Spinner /></div>

  const worker = dashData?.worker
  const isFrozen = worker?.payment_status === 'FROZEN'

  return (
    <div className="pt-20 pb-12 px-4 max-w-2xl mx-auto fade-in">

      {isFrozen && (
        <div className="mb-4 bg-red-950/40 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm">
          🔒 {t(lang, 'frozenWarning')}
        </div>
      )}

      {/* Claim result */}
      {result && (
        <Card className="mb-4 border border-green-700/40 bg-green-950/10">
          <div className="text-green-400 font-semibold mb-3">✓ Claim Processed</div>
          <div className="bg-surface rounded-lg p-4 font-mono text-xs space-y-1.5">
            <Row label="Worker" value={result.worker} />
            <Row label="Zone" value={result.zone} />
            <Row label="Event" value={result.event_type} />
            <Row label="Your Shift" value={result.shift} />
            <Row label="Disruption Window" value={result.disruption_window} />
            <div className="border-t border-border my-2" />
            <Row label="Overlap Hours" value={`${result.overlap_hours}h`} highlight />
            <Row label="Total Working Hours" value={`${result.total_working_hours}h`} />
            <Row label="Daily Income" value={`₹${result.daily_income}`} />
            <Row label="Disruption Factor" value={result.disruption_factor} />
            <div className="text-text-dim mt-1">Formula: {result.formula}</div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-accent font-bold">Payout</span>
              <span className="text-accent font-bold text-lg">₹{result.payout}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-dim">Status</span>
              <Tag color={result.status === 'approved' ? 'green' : 'gray'}>{result.status}</Tag>
            </div>
          </div>
          <button onClick={() => setResult(null)} className="mt-3 text-xs text-text-dim hover:text-text">Dismiss</button>
        </Card>
      )}

      {error && (
        <div className="mb-4 bg-red-950/40 border border-red-700/50 rounded-xl px-4 py-3 text-red-400 text-sm">{error}
          <button onClick={() => setError('')} className="ml-3 text-xs text-red-300 hover:text-red-200">×</button>
        </div>
      )}

      {/* Active disruption events */}
      <Card className="mb-4">
        <div className="text-text-dim text-xs font-mono mb-3">{t(lang, 'fileClaim').toUpperCase()} — YOUR ZONE: {user?.zone}</div>

        {events.filter(e => e.zone === user?.zone).length === 0 ? (
          <div className="text-text-dim text-sm py-4 text-center">{t(lang, 'noClaim')}</div>
        ) : (
          events.filter(e => e.zone === user?.zone).map(ev => {
            const overlapHours = dashData?.active_disruption_events?.find(a => a.id === ev.id)?.overlap_hours ?? 0
            const estPayout = worker ? (worker.daily_income * ev.disruption_factor * (overlapHours / worker.working_hours)).toFixed(0) : 0

            return (
              <div key={ev.id} className="border border-border rounded-xl p-4 mb-3 last:mb-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text capitalize">{ev.event_type}</span>
                      <Tag color={ev.severity === 'high' || ev.severity === 'critical' ? 'red' : ev.severity === 'medium' ? 'yellow' : 'green'}>
                        {ev.severity}
                      </Tag>
                    </div>
                    <div className="text-text-dim text-xs mt-1">{ev.description}</div>
                  </div>
                  <div className="text-xs font-mono text-text-dim">{ev.source}</div>
                </div>

                {/* Overlap breakdown */}
                <div className="bg-surface rounded-lg p-3 mb-3 font-mono text-xs space-y-1">
                  <Row label={t(lang, 'yourShift')} value={worker ? `${worker.shift_start} – ${worker.shift_end}` : '–'} />
                  <Row label={t(lang, 'disruptionWindow')} value={`${ev.event_start.slice(11,16)} – ${ev.event_end.slice(11,16)}`} />
                  <div className="border-t border-border my-1" />
                  <Row label={t(lang, 'overlapHours')} value={`${overlapHours}h`} highlight={overlapHours > 0} />
                  <Row label="Working Hours" value={`${worker?.working_hours}h`} />
                  <Row label="Daily Income" value={`₹${worker?.daily_income}`} />
                  <Row label={t(lang, 'disruptionFactor')} value={ev.disruption_factor} />
                  <div className="border-t border-border my-1" />
                  <div className="text-text-dim">{t(lang, 'payoutFormula')}: ₹{worker?.daily_income} × {ev.disruption_factor} × ({overlapHours}/{worker?.working_hours}h)</div>
                  <div className="flex justify-between font-bold mt-1">
                    <span className={overlapHours > 0 ? 'text-accent' : 'text-text-dim'}>
                      {overlapHours > 0 ? t(lang, 'claimEligible') : t(lang, 'claimNotEligible')}
                    </span>
                    <span className={overlapHours > 0 ? 'text-accent' : 'text-text-dim'}>
                      {overlapHours > 0 ? `₹${estPayout}` : '₹0'}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isFrozen || filing === ev.id}
                  onClick={() => handleFile(ev.id)}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isFrozen
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : overlapHours > 0
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-border text-text-dim hover:bg-border/80'
                  }`}
                >
                  {filing === ev.id ? 'Filing...' : isFrozen ? '🔒 Account Frozen' : overlapHours > 0 ? `File Claim — ₹${estPayout}` : 'File Claim (₹0 — No Overlap)'}
                </button>
              </div>
            )
          })
        )}
      </Card>

      {/* All disruption events (other zones for context) */}
      {events.filter(e => e.zone !== user?.zone).length > 0 && (
        <Card className="mb-4">
          <div className="text-text-dim text-xs font-mono mb-3">OTHER ZONE EVENTS</div>
          {events.filter(e => e.zone !== user?.zone).map(ev => (
            <div key={ev.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
              <div>
                <span className="text-text-dim">{ev.zone}</span>
                <span className="text-text-dim mx-2">·</span>
                <span className="text-text capitalize">{ev.event_type}</span>
              </div>
              <Tag color="gray">Not your zone</Tag>
            </div>
          ))}
        </Card>
      )}

      {/* Past claims */}
      <Card>
        <div className="text-text-dim text-xs font-mono mb-3">YOUR CLAIM HISTORY</div>
        {claims.length === 0 ? (
          <div className="text-text-dim text-sm">No claims filed yet.</div>
        ) : (
          claims.map(c => (
            <div key={c.id} className="py-3 border-b border-border last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text text-sm font-medium capitalize">{c.event}</div>
                  <div className="text-text-dim text-xs mt-0.5">{c.timestamp}</div>
                  <div className="text-text-dim text-xs font-mono mt-1">
                    Shift {c.shift} · Disruption {c.disruption_window} · {c.overlap_hours}h overlap
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-accent font-mono font-bold">₹{c.payout}</div>
                  <Tag color={c.status === 'approved' ? 'green' : c.status === 'not_eligible' ? 'gray' : 'red'}>
                    {c.status}
                  </Tag>
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-dim">{label}</span>
      <span className={highlight ? 'text-accent font-bold' : 'text-text'}>{value}</span>
    </div>
  )
}
