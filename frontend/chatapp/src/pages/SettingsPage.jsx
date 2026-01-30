import './../../Auth/auth.css'
import { useTheme } from '../providers/ThemeProvider'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import { api } from '../api/client'
import './../../user/settings.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { me, logout } = useAuth()
  const { push } = useToast()
  const nav = useNavigate()

  const [notifications, setNotifications] = useState(true)
  const [privacy, setPrivacy] = useState('everyone')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!me) return
    async function load() {
      try {
        const res = await api.get(`/api/users/${me.id}/settings`)
        if (res.data.settings) {
          const next = Boolean(res.data.settings.notifications_enabled)
          setNotifications(next)
          setPrivacy(res.data.settings.privacy_last_seen || 'everyone')
          localStorage.setItem('notifications_enabled', next ? '1' : '0')
          loading && setLoading(false);
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [me])

  const save = async (nextTheme) => {
    if (!me) return
    setBusy(true)
    try {
      await api.put(`/api/users/${me.id}/settings`, {
        theme: nextTheme,
        notifications_enabled: notifications ? 1 : 0,
        privacy_last_seen: privacy,
      })
      localStorage.setItem('notifications_enabled', notifications ? '1' : '0')
      push({ type: 'success', message: 'Settings saved' })
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to save settings' })
    } finally {
      setBusy(false)
    }
  }

  const onToggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    toggleTheme()
    await save(next)
  }

  if (!me) return null

  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const avatarUrl = me.profile_photo ? base + me.profile_photo : null

  return (
    <div className="settings-page">
      <div className="top-bar">
        <div className="top-inner">
          <button className="icon-btn" onClick={() => nav(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="top-title">Settings</div>
          <div style={{ width: 40 }} />
        </div>
      </div>

      <div className="settings-container">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-left">
            <div
              className="profile-avatar"
              style={{
                backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
              }}
            >
              {!avatarUrl ? (
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                  {me.username?.slice(0, 2).toUpperCase()}
                </span>
              ) : null}
            </div>

            <div className="profile-info">
              <div className="profile-name">{me.username}</div>
              <div className="profile-status">
                <span className="online-dot" />
                {me.status || 'Online'}
              </div>
            </div>
          </div>

          <button className="edit-profile-btn" onClick={() => nav('/profile')}>
            Edit
          </button>
        </div>

        {/* SECTION TITLE */}
        <div className="section-title">PREFERENCES</div>

        {/* THEME */}
        <div className="setting-item" onClick={onToggleTheme}>
          <div className="item-left">
            <div className="item-icon palette">
              <span className="material-symbols-outlined">palette</span>
            </div>
            <div className="item-text">
              <div className="item-title">Theme</div>
              <div className="item-desc">Current: {theme}</div>
            </div>
          </div>
          <div className="item-right">
            <span className="right-text">Toggle</span>
            <span className="chevron material-symbols-outlined">chevron_right</span>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div
          className="setting-item"
          onClick={() => setNotifications((v) => !v)}
        >
          <div className="item-left">
            <div className="item-icon notifications_active">
              <span className="material-symbols-outlined">
                {notifications ? 'notifications' : 'notifications_off'}
              </span>
            </div>
            <div className="item-text">
              <div className="item-title">Notifications</div>
              <div className="item-desc">In-app notifications</div>
            </div>
          </div>

          <div className="item-right">
            <div className="toggle">
              <div className="toggle-circle" style={{ right: notifications ? 2 : 'calc(100% - 20px)' }} />
            </div>
          </div>
        </div>

        {/* PRIVACY */}
        <div className="setting-item">
          <div className="item-left">
            <div className="item-icon shield_person">
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <div className="item-text">
              <div className="item-title">Privacy</div>
              <div className="item-desc">Last seen visibility</div>
            </div>
          </div>

          <select
            className="input"
            style={{ width: 160 }}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            disabled={busy}
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <div className="logout-section">
          <button
            className="saving-btn"
            onClick={() => save(theme)}
            disabled={busy}
          >
            <span className="material-symbols-outlined">save</span>
            <div className='saving'>{busy ? 'Saving…' : 'Save Settings'}</div>
          </button>
        </div>

        {/* LOGOUT */}
        <div className="logout-section">
          <button className="logout-btn" onClick={() => logout()}>
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>

        <div className="footer-info">
          ChatApp • version 1.0 • Secure & private
          <div className="secure">
            <span className="material-symbols-outlined verified">verified</span>
            <span className="verified">End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
