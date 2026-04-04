import React, { useEffect, useState } from 'react'
import { getAdminDashboard, workerAction, getTriggerFeed } from '../utils/api'
import { Card, KPICard, Spinner, Tag, SeverityDot } from '../components/UI'

const STATUS_COLORS = {
  ACTIVE: 'green', PAYMENT_DUE: 'yellow', GRACE_PERIOD: 'orange', FROZEN: 'red'
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)
  const [msg, setMsg] = useState('')

  const reload = () => {
    setLoading(true)
    Promise.all([getAdminDashboard(), getTriggerFeed()])
      .then(([d, f]) => { setData(d); setFeed(f) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [])

  const doAction = async (action, worker_id, workerName) => {
    setActing(`${action}-${worker_id}`)
    try {
      const res = await workerAction({ action, worker_id })
      setMsg(`✓ ${res.worker} → ${res.status}`)
      reload()
    } catch (err) {
      setMsg(`✗ ${err?.response?.data?.detail || 'Action failed'}`)
    } finally { setActing(null) }
  }

  if (loading) return <div className="pt-20"><Spinner /></div>
  const { kpis, zones, workers } = data

  return (
    <div className="pt-20 pb-12 px-4 max-w-6xl mx-auto fade-in">
      <div className="mb-6">
        <div className="text-text-dim text-xs font-mono mb-1">ADMIN PORTAL</div>
        <div className="font-display font-bold text-2xl text-text">Operations Overview</div>
      </div>

      {msg && (
        <div className="mb-4 bg-panel border border-border rounded-lg px-4 py-2 text-sm text-text flex justify-between">
          {msg} <button onClick={() => setMsg('')} className="text-text-dim hover:text-text">×</button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KPICard label="Workers" value={kpis.active_workers} icon="👥" />
        <KPICard label="High Risk Zones" value={kpis.high_risk_zones} icon="⚠️" color="text-red-400" />
        <KPICard label="Claims Today" value={kpis.claims_today} icon="📋" color="text-yellow-400" />
        <KPICard label="Frozen" value={kpis.frozen_accounts} icon="🔒" color="text-red-400" />
        <KPICard label="Grace Period" value={kpis.grace_accounts} icon="⏳" color="text-orange-400" />
        <KPICard label="Total Payout" value={`₹${kpis.total_payout}`} icon="💸" color="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Workers table */}
        <div className="lg:col-span-2">
          <Card>
            <div className="text-text-dim text-xs font-mono mb-4">ALL WORKERS</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-dim text-xs font-mono border-b border-border">
                    <th className="text-left pb-2">Name</th>
                    <th className="text-left pb-2">Zone</th>
                    <th className="text-left pb-2">Shift</th>
                    <th className="text-right pb-2">Premium</th>
                    <th className="text-left pb-2 pl-3">Status</th>
                    <th className="text-left pb-2 pl-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id} className="border-b border-border/50 last:border-0 hover:bg-border/10">
                      <td className="py-2.5">
                        <div className="font-medium text-text">{w.name}</div>
                        <div className="text-text-dim text-xs">{w.city} {w.is_metro && <span className="text-blue-400">·M</span>}</div>
                      </td>
                      <td className="py-2.5 text-text-dim text-xs">{w.zone}</td>
                      <td className="py-2.5 text-text-dim text-xs font-mono">{w.shift_start}–{w.shift_end}</td>
                      <td className="py-2.5 text-right">
                        <span className="text-accent font-mono font-bold text-xs">₹{w.weekly_premium}</span>
                      </td>
                      <td className="py-2.5 pl-3">
                        <Tag color={STATUS_COLORS[w.payment_status] || 'gray'}>
                          {w.payment_status?.replace('_', ' ')}
                        </Tag>
                        {w.payment_due_date && (
                          <div className="text-text-dim text-xs mt-0.5">{w.payment_due_date}</div>
                        )}
                      </td>
                      <td className="py-2.5 pl-3">
                        <div className="flex gap-1 flex-wrap">
                          {w.payment_status !== 'FROZEN' ? (
                            <button
                              onClick={() => doAction('freeze', w.id, w.name)}
                              disabled={acting === `freeze-${w.id}`}
                              className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors disabled:opacity-50"
                            >
                              🔒 Freeze
                            </button>
                          ) : (
                            <button
                              onClick={() => doAction('unfreeze', w.id, w.name)}
                              disabled={acting === `unfreeze-${w.id}`}
                              className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded hover:bg-green-900/50 transition-colors disabled:opacity-50"
                            >
                              🔓 Unfreeze
                            </button>
                          )}
                          {w.payment_status !== 'ACTIVE' && (
                            <button
                              onClick={() => doAction('mark_paid', w.id, w.name)}
                              disabled={acting === `mark_paid-${w.id}`}
                              className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors disabled:opacity-50"
                            >
                              ✓ Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Zone risk */}
          <Card>
            <div className="text-text-dim text-xs font-mono mb-3">ZONE RISK OVERVIEW</div>
            {zones.map(z => (
              <div key={z.zone} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-text text-xs">{z.zone}</div>
                  <div className="text-text-dim text-xs">{z.city}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-mono font-bold ${z.current_level === 'HIGH' ? 'text-red-400' : z.current_level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {z.current_level}
                  </div>
                  <div className="text-accent text-xs font-mono">₹{z.weekly_premium}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Trigger feed */}
          <Card>
            <div className="text-text-dim text-xs font-mono mb-3">LIVE TRIGGER FEED</div>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {feed.slice(0, 12).map(f => (
                <div key={f.id} className="flex items-start gap-2 text-xs">
                  <SeverityDot severity={f.severity} />
                  <div>
                    <span className="text-text-dim">{f.zone}</span>
                    <span className="text-text mx-1">—</span>
                    <span className="text-text">{f.description}</span>
                    <div className="text-text-dim text-xs mt-0.5">{f.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Frozen / Grace list */}
          {workers.filter(w => ['FROZEN', 'GRACE_PERIOD', 'PAYMENT_DUE'].includes(w.payment_status)).length > 0 && (
            <Card>
              <div className="text-text-dim text-xs font-mono mb-3">ATTENTION REQUIRED</div>
              {workers.filter(w => ['FROZEN', 'GRACE_PERIOD', 'PAYMENT_DUE'].includes(w.payment_status)).map(w => (
                <div key={w.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <div>
                    <div className="text-text text-xs">{w.name}</div>
                    <div className="text-text-dim text-xs">{w.zone}</div>
                  </div>
                  <Tag color={STATUS_COLORS[w.payment_status] || 'gray'}>
                    {w.payment_status?.replace('_', ' ')}
                  </Tag>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
