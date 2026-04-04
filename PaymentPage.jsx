import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../utils/api'
import { setToken, setUser } from '../utils/auth'

const ZONES = ['Kasavanahalli', 'Bellandur', 'HSR Layout', 'Electronic City', 'Whitefield', 'Marathahalli', 'Lakdikapul', 'Banjara Hills', 'Hitech City']
const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Pune']

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    city: 'Bengaluru', zone: 'Kasavanahalli',
    daily_income: 500, working_hours: 8,
    shift_start: '09:00', shift_end: '17:00',
    language: 'en',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await signup({ ...form, daily_income: parseFloat(form.daily_income), working_hours: parseFloat(form.working_hours) })
      setToken(data.token)
      setUser(data.worker)
      navigate('/worker', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold">P</span>
        </div>
        <div className="font-display font-bold text-2xl text-text">Create Account</div>
        <div className="text-text-dim text-sm mt-1">Register as a gig worker</div>
      </div>

      <div className="w-full max-w-md bg-panel border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Row helper */}
          {[
            { label: 'FULL NAME', key: 'name', type: 'text', placeholder: 'Your name' },
            { label: 'EMAIL', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'PASSWORD', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-text-dim text-xs font-mono block mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">CITY</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">ZONE</label>
              <select value={form.zone} onChange={e => set('zone', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent">
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">DAILY INCOME (₹)</label>
              <input type="number" value={form.daily_income} onChange={e => set('daily_income', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">WORKING HOURS</label>
              <input type="number" step="0.5" value={form.working_hours} onChange={e => set('working_hours', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">SHIFT START</label>
              <input type="time" value={form.shift_start} onChange={e => set('shift_start', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-text-dim text-xs font-mono block mb-1.5">SHIFT END</label>
              <input type="time" value={form.shift_end} onChange={e => set('shift_end', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="text-text-dim text-xs font-mono block mb-1.5">LANGUAGE</label>
            <select value={form.language} onChange={e => set('language', e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-700/50 rounded-lg px-3 py-2 text-red-400 text-xs">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 mt-1">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>

      <div className="text-center mt-4 text-text-dim text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">Sign in</Link>
      </div>
    </div>
  )
}
