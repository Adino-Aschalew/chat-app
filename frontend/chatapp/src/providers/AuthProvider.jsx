import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (!token) {
          setMe(null)
          return
        }
        const res = await api.get('/api/auth/me')
        if (!cancelled) setMe(res.data.user)
      } catch {
        if (!cancelled) {
          setMe(null)
          setToken('')
          localStorage.removeItem('token')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    setLoading(true)
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const login = async ({ email, password }) => {
    const res = await api.post('/api/auth/login', { email, password })
    const t = res.data.token
    localStorage.setItem('token', t)
    setToken(t)
    setMe(res.data.user)
  }

  const register = async ({ username, email, password }) => {
    console.log('AuthProvider - Registering user:', { username, email })
    const res = await api.post('/api/users/register', { username, email, password })
    console.log('AuthProvider - Registration response:', res.data)
    const t = res.data.token
    localStorage.setItem('token', t)
    setToken(t)
    setMe(res.data.user)
    console.log('AuthProvider - User set after registration:', res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setMe(null)
  }

  const value = useMemo(
    () => ({
      token,
      me,
      loading,
      isAuthed: Boolean(token && me),
      login,
      register,
      logout,
      setMe,
    }),
    [token, me, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  
  // Debug: log current auth state
  console.log('useAuth - Current auth state:', {
    token: ctx.token ? 'exists' : 'none',
    me: ctx.me ? 'exists' : 'none',
    isAuthed: ctx.isAuthed,
    loading: ctx.loading
  })
  
  return ctx
}

