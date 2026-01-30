import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import '../../Auth/auth.css';

export function LoginPage() {
  const { login } = useAuth()
  const { push } = useToast()
  const nav = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(
    () => location.state?.from || '/home',
    [location.state]
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await login({ email, password })
      nav(redirectTo, { replace: true })
    } catch (err) {
      push({
        type: 'error',
        message: err?.response?.data?.message || 'Login failed',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Top bar */}
      <div className="top-bar">
        <span className="material-symbols-outlined close-icon">close</span>
        <h2>Login</h2>
      </div>

      {/* Main layout */}
      <div className="auth-container">
        {/* Left side */}
        <div className="auth-left">
          <div className="gradient-box">
            <div className="gradient-content">
              <h2>Welcome back 👋</h2>
              <p>Sign in to continue chatting with your friends.</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Sign In</h2>
              <p>Enter your credentials</p>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>
                  <Link to="/forgot">Forgot?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button className="primary-btn" disabled={busy}>
                {busy ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <div className="switch-auth">
              Don’t have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
