import './../../Auth/auth.css'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'
import { useNavigate } from 'react-router-dom'

export function GroupCreatePage() {
  const { push } = useToast()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState({}) // id -> user
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const term = q.trim()
      if (!term) {
        setUsers([])
        return
      }
      try {
        const res = await api.get('/api/users', { params: { q: term } })
        if (!cancelled) setUsers(res.data.users || [])
      } catch (err) {
        push({ type: 'error', message: err?.response?.data?.message || 'Search failed' })
      }
    }
    const t = window.setTimeout(run, 300)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [q,push])

  const toggle = (u) => {
    setSelected((cur) => {
      const next = { ...cur }
      if (next[u.id]) delete next[u.id]
      else next[u.id] = u
      return next
    })
  }

  const create = async () => {
    const memberIds = Object.keys(selected).map(Number)
    if (!name.trim()) return push({ type: 'error', message: 'Group name is required' })
    if (memberIds.length === 0) return push({ type: 'error', message: 'Pick at least one member' })
    setBusy(true)
    try {
      const res = await api.post('/api/chats/group', { name: name.trim(), memberIds })
      nav(`/groups/${res.data.chatId}`)
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to create group' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="page-title">
        <h1>Create group</h1>
      </div>
      <div className="card">
        <div className="col">
          <div className="col">
            <div className="label">Group name</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Friends" />
          </div>

          <div className="col">
            <div className="label">Search users to add</div>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by username or email…" />
          </div>

          <div className="col">
            {users.map((u) => {
              const picked = Boolean(selected[u.id])
              return (
                <button key={u.id} className={`btn ${picked ? 'btn-primary' : ''}`} onClick={() => toggle(u)} style={{ justifyContent: 'space-between' }}>
                  <span className="row">
                    <span className="material-symbols-rounded">{picked ? 'check_circle' : 'person'}
                    </span>
                    <span className='user-info'>
                     <span className='name'>{u.username}</span>
                      <span className='muted'>{u.email}</span>
                    </span>
                  </span>
                  <span className="material-symbols-rounded">{picked ? 'remove' : 'add'}</span>
                </button>
              )
            })}
          </div>

          <div className="muted">
            Selected: {Object.keys(selected).length}
          </div>

          <button className="btn btn-primary" onClick={create} disabled={busy}>
            <span className="material-symbols-rounded">groups</span> {busy ? 'Creating…' : 'Create group'}
          </button>
        </div>
      </div>
    </div>
  )
}

