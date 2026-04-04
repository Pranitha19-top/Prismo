import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WorkerDashboard from './pages/WorkerDashboard'
import RiskMapPage from './pages/RiskMapPage'
import PolicyPage from './pages/PolicyPage'
import ClaimsPage from './pages/ClaimsPage'
import PaymentPage from './pages/PaymentPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminZoneAnalytics from './pages/AdminZoneAnalytics'
import { getToken, getUser, clearToken, setToken, setUser } from './utils/auth'

export const LangContext = React.createContext({ lang: 'en', setLang: () => {} })

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = getToken()
  const user = getUser()
  if (!token || !user) return <Navigate to="/login" replace />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/worker" replace />
  return children
}

function WorkerRoute({ children }) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  const [lang, setLang] = useState(() => getUser()?.language || 'en')
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = location.pathname === '/login' || location.pathname === '/signup'

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = getToken()
    const user = getUser()
    if (token && user && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/')) {
      if (user.role === 'admin') navigate('/admin', { replace: true })
      else navigate('/worker', { replace: true })
    }
  }, [location.pathname])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-surface">
        {!isAuth && <Navbar onLogout={handleLogout} />}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Worker routes */}
            <Route path="/worker" element={<ProtectedRoute><WorkerRoute><WorkerDashboard /></WorkerRoute></ProtectedRoute>} />
            <Route path="/worker/map" element={<ProtectedRoute><WorkerRoute><RiskMapPage /></WorkerRoute></ProtectedRoute>} />
            <Route path="/worker/policy" element={<ProtectedRoute><WorkerRoute><PolicyPage /></WorkerRoute></ProtectedRoute>} />
            <Route path="/worker/claims" element={<ProtectedRoute><WorkerRoute><ClaimsPage /></WorkerRoute></ProtectedRoute>} />
            <Route path="/worker/payment" element={<ProtectedRoute><WorkerRoute><PaymentPage /></WorkerRoute></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/zones" element={<ProtectedRoute requireAdmin><AdminZoneAnalytics /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </LangContext.Provider>
  )
}
