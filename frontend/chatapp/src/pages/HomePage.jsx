import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './../../Auth/auth.css'
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'
import { useSocket } from '../providers/SocketProvider'

export function HomePage() {
  const nav = useNavigate()
  const { push } = useToast()
  const { socket } = useSocket()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/chats')
      setChats(res.data.chats || [])
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to load chats' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // live refresh on new messages / group updates
    if (!socket) return
    const refresh = () => load()
    socket.on('new_message', refresh)
    socket.on('read_message', refresh)
    socket.on('group_updated', refresh)
    socket.on('member_added', refresh)
    socket.on('member_removed', refresh)
    return () => {
      socket.off('new_message', refresh)
      socket.off('read_message', refresh)
      socket.off('group_updated', refresh)
      socket.off('member_added', refresh)
      socket.off('member_removed', refresh)
    }
  }, [socket])

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="page-title">
        <h1>Chats</h1>
        <Link className="btn btn-primary" to="/groups/new">
          <span className="material-symbols-rounded"> group_add</span> New group
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="muted">Loading…</div>
        ) : chats.length === 0 ? (
          <div className="muted">
            No chats yet. Go to <Link to="/contacts">Contacts</Link> to start one.
          </div>
        ) : (
          <div className="col">
            {chats.map((c) => {
              const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
              const avatarUrl = c.type === 'private' && c.peer_profile_photo ? base + c.peer_profile_photo : null
              const displayName = c.type === 'group' ? c.group_name || 'Group' : c.peer_username || 'Private chat'
              const initials = displayName
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <button
                  key={c.id}
                  className="btn"
                  style={{ justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => nav(c.type === 'group' ? `/groups/${c.id}` : `/chats/${c.id}`)}
                >
                  <span className="row" style={{ gap: 10, alignItems: 'center' }}>
                    {c.type === 'private' ? (
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: avatarUrl ? 'transparent' : 'rgba(43, 238, 121, 0.2)',
                            display: 'grid',
                            placeItems: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{initials}</span>
                          )}
                        </div>
                        {c.peer_online ? (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: 'var(--primary)',
                              border: '2px solid var(--surface)',
                            }}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
                        groups
                      </span>
                    )}
                    <span>
                      <div style={{ fontWeight: 700 }}>{displayName}</div>
                      {c.type === 'private' && c.peer_online ? (
                        <span className="muted" style={{ fontSize: 11 }}>
                          <span className="material-symbols-rounded" style={{ fontSize: 12, verticalAlign: 'middle' }}>
                            circle
                          </span>{' '}
                          online
                        </span>
                      ) : null}
                      {c.last_body ? (
                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                          {c.last_body.length > 42 ? c.last_body.slice(0, 42) + '…' : c.last_body}
                        </div>
                      ) : null}
                    </span>
                  </span>
                  <span className="row" style={{ gap: 10, alignItems: 'center' }}>
                    {c.unread_count > 0 ? (
                      <span
                        style={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: 12,
                          background: 'var(--primary)',
                          color: 'var(--primary-ink)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {c.unread_count}
                      </span>
                    ) : null}
                    <span className="material-symbols-rounded">chevron_right</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

