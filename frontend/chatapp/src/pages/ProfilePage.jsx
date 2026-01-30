import { useState, useEffect } from 'react'
import './../../Auth/auth.css'
import './../../Auth/profileSetup.css'
import { api } from '../api/client'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { me, setMe } = useAuth()
  const { push } = useToast()
  const nav = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(me?.username || '')
  const [status, setStatus] = useState(me?.status || '')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (me) {
      setUsername(me.username || '')
      setStatus(me.status || '')
    }
  }, [me])

  if (!me) return null

  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const avatarUrl = me.profile_photo ? base + me.profile_photo : null
  const initials = (me.username || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const onSave = async () => {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('username', username)
      fd.append('status', status)
      if (profilePhoto) fd.append('profilePhoto', profilePhoto)

      const res = await api.put(`/api/users/${me.id}`, fd)
      setMe(res.data.user)
      setIsEditing(false)
      setProfilePhoto(null)
      push({ type: 'success', message: 'Profile updated' })
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Update failed' })
    } finally {
      setBusy(false)
    }
  }

  const onCancel = () => {
    setIsEditing(false)
    setUsername(me?.username || '')
    setStatus(me?.status || '')
    setProfilePhoto(null)
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* TOP BAR */}
        <div className="top-bar">
          <button className="icon-btn" onClick={() => nav(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2>Profile</h2>
          <div className="spacer" />
        </div>

        {/* TITLE */}
        <div className="title">{me?.username || 'User'}'s Profile</div>
        <div className="subtitle">Update your username, status and profile photo anytime.</div>

        {/* AVATAR */}
        <div className="photo-section">
          <div className="photo-wrapper">
            <div className="photo-circle">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span className="photo-icon">{initials}</span>
              )}
            </div>

            {isEditing ? (
              <div className="photo-add">
                <span className="material-symbols-outlined">edit</span>
              </div>
            ) : null}
          </div>

          <div className="photo-text">
            <div className="photo-title">{me.username || 'User'}</div>
            <div className="photo-subtitle">{me.status || 'No status set'}</div>
          </div>
        </div>

        {/* FORM */}
        <div className="bio-section">
          {!isEditing ? (
            <>
              <div className="bio-wrapper">
                <label>Username</label>
                <div style={{ marginTop: 8, textTransform:'capitalize', fontSize: 14, color: '#94a3b8', padding: 8, fontWeight: 500, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>{me.username}</div>
              </div>

              <div className="bio-wrapper" style={{ marginTop: 16 }}>
                <label>Status</label>
                <div style={{ marginTop: 8, fontSize: 14, textTransform:'capitalize', color: '#94a3b8', padding: 8, fontWeight: 500, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
                  {me.status || 'No status set'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bio-wrapper">
                <label>Username</label>
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 8,
                    padding: '14px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="bio-wrapper" style={{ marginTop: 16 }}>
                <label>Status</label>
                <input
                  className="input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 8,
                    padding: '14px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="bio-wrapper" style={{ marginTop: 16 }}>
                <label>Profile photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  style={{ marginTop: 8, color: 'white', width: '100%',padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="actions">
          {!isEditing ? (
            <button className="primary-btn" onClick={() => setIsEditing(true)}>
              <span className="material-symbols-outlined">edit</span> Edit Profile
            </button>
          ) : (
            <>
              <button className="primary-btn" onClick={onSave} disabled={busy}>
                <span className="material-symbols-outlined">save</span> {busy ? 'Saving…' : 'Save'}
              </button>

              <button className="secondary-btn" onClick={onCancel} disabled={busy}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
