import './../../Auth/auth.css'
import './ContactPage.css'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'
import { useNavigate } from 'react-router-dom'

export function ContactsPage() {
  const { push } = useToast()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const term = q.trim()
      if (!term) {
        setUsers([])
        return
      }
      setBusy(true)
      try {
        const res = await api.get('/api/users', { params: { q: term } })
        if (!cancelled) setUsers(res.data.users || [])
      } catch (err) {
        push({ type: 'error', message: err?.response?.data?.message || 'Search failed' })
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    const t = window.setTimeout(run, 300)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [q, push])

  const invite = async (userId) => {
    try {
      const res = await api.post('/api/chats', { userId })
      nav(`/chats/${res.data.chatId}`)
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to create chat' })
    }
  }

  return (
    <div className="contacts-page col" style={{ gap: 12 }}>
      <div className="page-title">
        <h1>Contacts</h1>
      </div>

      <div className="contacts-card card">
        <div className="col" style={{ gap: 10 }}>
          <div className="col" style={{ gap: 6 }}>
            <div className="label">Search users</div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by username or email…"
            />
          </div>

          {busy ? (
            <div className="muted">Searching…</div>
          ) : users.length === 0 ? (
            <div className="muted contacts-empty">Type to search.</div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {users.map((u) => (
                <div key={u.id} className="contacts-user row" style={{ justifyContent: 'space-between' }}>
                  <div className="user-info col">
                    <div className="username">{u.username}</div>
                    <div className="email">{u.email}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => invite(u.id)}>
                    <span className="material-symbols-rounded">chat</span> Invite
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
