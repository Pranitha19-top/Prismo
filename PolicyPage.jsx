import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../utils/api'
import { setToken, setUser } from '../utils/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // null | 'worker' | 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const prefill = (type) => {
    setMode(type)
    setError('')
    if (type === 'admin') { setEmail('admin@prismo.in'); setPassword('admin123') }
    else { setEmail('ravi@prismo.in'); setPassword('ravi123') }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login({ email, password })
      if (mode === 'admin' && data.worker.role !== 'admin') {
        setError('This account is not an admin. Use Worker Portal.')
        setLoading(false); return
      }
      if (mode === 'worker' && data.worker.role === 'admin') {
        setError('This is an admin account. Use Admin Portal.')
        setLoading(false); return
      }
      setToken(data.token)
      setUser(data.worker)
      navigate(data.worker.role === 'admin' ? '/admin' : '/worker', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">P</span>
        </div>
        <div className="font-display font-bold text-3xl text-text tracking-tight">PRISMO</div>
        <div className="text-text-dim text-sm mt-1">AI Insurance for Gig Workers</div>
      </div>

      {/* Portal selector */}
      {!mode ? (
        <div className="w-full max-w-sm">
          <div className="text-text-dim text-xs font-mono text-center mb-5 tracking-widest">SELECT PORTAL</div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => prefill('worker')}
              className="w-full bg-panel border border-border hover:border-accent/60 rounded-xl p-5 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛵</span>
                <div>
                  <div className="font-display font-semibold text-text group-hover:text-accent transition-colors">Worker Portal</div>
                  <div className="text-text-dim text-xs mt-0.5">Gig workers — delivery, rides, services</div>
                </div>
                <span className="ml-auto text-text-dim group-hover:text-accent">→</span>
              </div>
            </button>
            <button
              onClick={() => prefill('admin')}
              className="w-full bg-panel border border-border hover:border-accent/60 rounded-xl p-5 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <div className="font-display font-semibold text-text group-hover:text-accent transition-colors">Admin Portal</div>
                  <div className="text-text-dim text-xs mt-0.5">Operations & risk management</div>
                </div>
                <span className="ml-auto text-text-dim group-hover:text-accent">→</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <button
            onClick={() => { setMode(null); setError('') }}
            className="text-text-dim text-xs font-mono mb-6 hover:text-text flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="bg-panel border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">{mode === 'admin' ? '🏢' : '🛵'}</span>
              <div className="font-display font-semibold text-text">
                {mode === 'admin' ? 'Admin Portal' : 'Worker Portal'}
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-text-dim text-xs font-mono block mb-1.5">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-text-dim text-xs font-mono block mb-1.5">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-700/50 rounded-lg px-3 py-2 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-4 bg-surface rounded-lg p-3 border border-border">
              <div className="text-text-dim text-xs font-mono mb-1.5">DEMO CREDENTIALS</div>
              {mode === 'admin' ? (
                <div className="text-xs text-text-dim space-y-0.5">
                  <div>admin@prismo.in / admin123</div>
                </div>
              ) : (
                <div className="text-xs text-text-dim space-y-0.5">
                  <div>ravi@prismo.in / ravi123</div>
                  <div>himesh@prismo.in / himesh123</div>
                  <div>priya@prismo.in / priya123</div>
                  <div>suresh@prismo.in / suresh123</div>
                </div>
              )}
            </div>
          </div>

          {mode === 'worker' && (
            <div className="text-center mt-4 text-text-dim text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:underline">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
