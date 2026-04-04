export function getToken() {
  return localStorage.getItem('prismo_token')
}
export function setToken(token) {
  localStorage.setItem('prismo_token', token)
}
export function clearToken() {
  localStorage.removeItem('prismo_token')
  localStorage.removeItem('prismo_user')
}
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('prismo_user') || 'null')
  } catch { return null }
}
export function setUser(user) {
  localStorage.setItem('prismo_user', JSON.stringify(user))
}
export function isLoggedIn() {
  return !!getToken()
}
export function isAdmin() {
  return getUser()?.role === 'admin'
}
