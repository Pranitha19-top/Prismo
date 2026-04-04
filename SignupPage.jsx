import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

// Attach JWT token
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('prismo_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auth
export const login = (data) => API.post('/auth/login', data).then(r => r.data)
export const signup = (data) => API.post('/auth/signup', data).then(r => r.data)
export const getMe = () => API.get('/auth/me').then(r => r.data)

// Workers
export const getWorkers = () => API.get('/workers').then(r => r.data)
export const getWorkerDashboard = (id) => API.get(`/workers/${id}/dashboard`).then(r => r.data)

// Zones
export const getAllZones = () => API.get('/zones').then(r => r.data)
export const getZoneRisk = (zone) => API.get(`/zones/${encodeURIComponent(zone)}/risk`).then(r => r.data)
export const getZonePremium = (zone) => API.get(`/zones/${encodeURIComponent(zone)}/premium`).then(r => r.data)

// Claims
export const getClaims = (workerId) => API.get('/claims', { params: workerId ? { worker_id: workerId } : {} }).then(r => r.data)
export const triggerClaim = (data) => API.post('/claims/trigger', data).then(r => r.data)

// Disruption events
export const getDisruptionEvents = (zone) => API.get('/disruption-events', { params: zone ? { zone } : {} }).then(r => r.data)

// Payment
export const makePayment = () => API.post('/payments/pay').then(r => r.data)
export const getPaymentHistory = () => API.get('/payments/history').then(r => r.data)

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard').then(r => r.data)
export const getFraudAlerts = () => API.get('/admin/fraud-alerts').then(r => r.data)
export const getTriggerFeed = () => API.get('/admin/trigger-feed').then(r => r.data)
export const getZoneAnalytics = () => API.get('/admin/zone-analytics').then(r => r.data)
export const getSameZoneComparison = (zone) => API.get('/admin/same-zone-comparison', { params: { zone } }).then(r => r.data)
export const createDisruptionEvent = (data) => API.post('/admin/disruption-events', data).then(r => r.data)
export const workerAction = (data) => API.post('/admin/worker-action', data).then(r => r.data)

// Weather
export const getWeather = (city) => API.get(`/weather/${city}`).then(r => r.data)
