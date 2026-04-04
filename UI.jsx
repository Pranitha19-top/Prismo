import React, { useEffect, useState, useContext } from 'react'
import { getWorkerDashboard, makePayment, getPaymentHistory } from '../utils/api'
import { getUser, setUser } from '../utils/auth'
import { Card, Spinner, Tag } from '../components/UI'
import { LangContext } from '../App'
import { t } from '../utils/i18n'

const STATUS_CONFIG = {
  ACTIVE:       { color: 'text-green-400', bg: 'border-green-700/40 bg-green-950/10', label: 'Active', icon: '✓' },
  PAYMENT_DUE:  { color: 'text-yellow-400', bg: 'border-yellow-700/40 bg-yellow-950/10', label: 'Payment Due', icon: '⚠️' },
  GRACE_PERIOD: { color: 'text-orange-400', bg: 'border-orange-700/40 bg-orange-950/10', label: 'Grace Period', icon: '⏳' },
  FROZEN:       { color: 'text-red-400', bg: 'border-red-700/50 bg-red-950/20', label: 'Account Frozen', icon: '🔒' },
}

export default function PaymentPage() {
  const { lang } = useContext(LangContext)
  const user = getUser()
  const [dash, setDash] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  const reload = () => {
    if (!user) return
    setLoading(true)
    Promise.all([
      getWorkerDashboard(user.id),
      getPaymentHistory(),
    ]).then(([d, h]) => { setDash(d); setHistory(h) }).finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [user?.id])

  const handlePay = async () => {
    setError(''); setSuccess(null); setPaying(true)
    try {
      const res = await makePayment()
      setSuccess(res)
      // Update local user cache
      const updated = { ...user, payment_status: 'ACTIVE' }
      setUser(updated)
      reload()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Payment failed')
    } finally { setPaying(false) }
  }

  if (loading) return <div className="pt-20"><Spinner /></div>

  const worker = dash?.worker
  const premium = dash?.premium
  const status = STATUS_CONFIG[worker?.payment_status] || STATUS_CONFIG.ACTIVE

  return (
    <div className="pt-20 pb-12 px-4 max-w-xl mx-auto fade-in">

      {/* Payment Status Card */}
      <Card className={`mb-4 border ${status.bg}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-text-dim text-xs font-mono mb-1">ACCOUNT STATUS</div>
            <div className={`font-display font-bold text-xl flex items-center gap-2 ${status.color}`}>
              <span>{status.icon}</span> {status.label}
            </div>
          </div>
          <div className="text-4xl">
            {worker?.payment_status === 'FROZEN' ? '🔒' : worker?.payment_status === 'ACTIVE' ? '✅' : '💳'}
          </div>
        </div>

        {/* Status details */}
        <div className="bg-surface rounded-lg p-3 font-mono text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'dueDate')}</span><span className="text-text">{worker?.payment_due_date || '—'}</span></div>
          <div className="flex justify-between"><span className="text-text-dim">{t(lang, 'graceDeadline')}</span><span className="text-text">{worker?.grace_deadline || '—'}</span></div>
          <div className="flex justify-between"><span className="text-text-dim">Current Premium</span><span className="text-accent font-bold">₹{premium?.weekly_premium}/week</span></div>
        </div>

        {/* Warnings */}
        {worker?.payment_status === 'FROZEN' && (
          <div className="mt-3 text-red-300 text-sm">{t(lang, 'frozenWarning')}</div>
        )}
        {worker?.payment_status === 'GRACE_PERIOD' && (
          <div className="mt-3 text-orange-300 text-sm">{t(lang, 'graceWarning')}</div>
        )}
        {worker?.payment_status === 'PAYMENT_DUE' && (
          <div className="mt-3 text-yellow-300 text-sm">{t(lang, 'dueWarning')}</div>
        )}
      </Card>

      {/* Pay Now */}
      <Card className="mb-4">
        <div className="text-text-dim text-xs font-mono mb-3">WEEKLY PREMIUM PAYMENT</div>

        {success ? (
          <div className="bg-green-950/20 border border-green-700/40 rounded-lg p-4 text-center">
            <div className="text-green-400 font-semibold text-lg mb-1">✓ Payment Successful</div>
            <div className="text-text-dim text-sm">Paid ₹{success.amount_paid}</div>
            <div className="text-text-dim text-xs mt-1">Next due: {success.next_due}</div>
            <button onClick={() => setSuccess(null)} className="mt-3 text-xs text-text-dim hover:text-text">Dismiss</button>
          </div>
        ) : (
          <>
            {/* Premium breakdown */}
            {premium && (
              <div className="bg-surface rounded-lg p-3 mb-4 font-mono text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-text-dim">Base ({premium.base_tier})</span><span className="text-text">₹{premium.base}</span></div>
                <div className="flex justify-between"><span className="text-text-dim">Metro ×{premium.metro_multiplier}</span><span className={premium.metro_multiplier > 1 ? 'text-yellow-400' : 'text-text-dim'}>{premium.metro_multiplier > 1 ? '+15%' : 'no change'}</span></div>
                <div className="flex justify-between"><span className="text-text-dim">7-day safety ×{premium.safety_multiplier}</span><span className={premium.safety_multiplier < 1 ? 'text-green-400' : premium.safety_multiplier > 1 ? 'text-red-400' : 'text-text-dim'}>{premium.safety_label}</span></div>
                <div className="flex justify-between"><span className="text-text-dim">Night shift ×{premium.shift_multiplier}</span><span className={premium.night_shift ? 'text-orange-400' : 'text-text-dim'}>{premium.night_shift ? '+5%' : 'no change'}</span></div>
                <div className="border-t border-border my-1" />
                <div className="flex justify-between font-bold text-sm"><span className="text-accent">Total this week</span><span className="text-accent">₹{premium.weekly_premium}</span></div>
              </div>
            )}

            {error && (
              <div className="mb-3 bg-red-950/40 border border-red-700/50 rounded-lg px-3 py-2 text-red-400 text-xs">{error}</div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg py-3 text-sm transition-colors disabled:opacity-50"
            >
              {paying ? 'Processing...' : `${t(lang, 'payNow')}${premium?.weekly_premium}`}
            </button>
            <div className="text-center text-text-dim text-xs mt-2">{t(lang, 'payNowDesc')}</div>
          </>
        )}
      </Card>

      {/* Payment History */}
      <Card>
        <div className="text-text-dim text-xs font-mono mb-3">{t(lang, 'paymentHistory').toUpperCase()}</div>
        {history.length === 0 ? (
          <div className="text-text-dim text-sm">No payments yet.</div>
        ) : (
          history.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div>
                <div className="text-text text-sm">Week of {p.week_start}</div>
                <div className="text-text-dim text-xs mt-0.5">{p.paid_at}</div>
              </div>
              <div className="text-right">
                <div className="text-accent font-mono font-medium">₹{p.amount}</div>
                <Tag color="green">{p.status}</Tag>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
