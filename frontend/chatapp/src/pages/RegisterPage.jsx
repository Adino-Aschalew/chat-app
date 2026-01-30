import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import '../../Auth/auth.css';

export function RegisterPage() {
  const { register } = useAuth()
  const { push } = useToast()
  const nav = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await register({ username, email, password })
      nav('/home', { replace: true })
    } catch (err) {
      push({
        type: 'error',
        message: err?.response?.data?.message || 'Registration failed',
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
        <h2>Register</h2>
      </div>

      {/* Main layout */}
      <div className="auth-container">
        {/* Left side */}
        <div className="auth-left">
          <div className="gradient-box">
            <div className="gradient-content">
              <h2>Join the conversation 💬</h2>
              <p>Create an account and start chatting instantly.</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Create account</h2>
              <p>It only takes a minute</p>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="cool_username"
                  required
                />
              </div>

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
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button className="primary-btn" disabled={busy}>
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </form>

            <div className="switch-auth">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
