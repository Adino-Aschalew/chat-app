import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import './../../Auth/auth.css'
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'
import { ChatPage } from './ChatPage'
import { useAuth } from '../providers/AuthProvider'

export function GroupChatPage() {
  const { chatId } = useParams()
  const { push } = useToast()
  const { me } = useAuth()

  const [chat, setChat] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupName, setGroupName] = useState('')
  const [groupPhoto, setGroupPhoto] = useState(null)
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)

  // ✅ derive current user's role
  const myRole = useMemo(
    () => members.find((m) => m.id === me?.id)?.role,
    [members, me?.id]
  )

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/chats/${chatId}`)
      setChat(res.data.chat)
      setMembers(res.data.members || [])
      setGroupName(res.data.chat?.group_name || '')
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to load group' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [chatId])

  // 🔍 debounced user search
  useEffect(() => {
    let cancelled = false

    async function run() {
      const term = q.trim()
      if (!term) {
        setResults([])
        return
      }

      try {
        const res = await api.get('/api/users', { params: { q: term } })
        if (cancelled) return

        const users = res.data.users || []

        // ✅ hide users already in the group + yourself
        const filtered = users.filter(
          (u) => !members.some((m) => m.id === u.id) && u.id !== me?.id
        )

        setResults(filtered)
      } catch (err) {
        push({ type: 'error', message: err?.response?.data?.message || 'Search failed' })
      }
    }

    const t = window.setTimeout(run, 300)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [q, members, me?.id])

  const saveGroup = async () => {
    setBusy(true)
    try {
      const fd = new FormData()
      if (groupName.trim()) fd.append('name', groupName.trim())
      if (groupPhoto) fd.append('groupPhoto', groupPhoto)

      const res = await api.put(`/api/chats/${chatId}`, fd)
      const updatedName = res.data.group?.name || groupName

      setChat((c) => ({ ...(c || {}), group_name: updatedName }))
      setGroupName(updatedName)

      push({ type: 'success', message: 'Group updated' })
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to update group' })
    } finally {
      setBusy(false)
    }
  }

  const addMember = async (userId) => {
    setBusy(true)
    try {
      const res = await api.post(`/api/chats/${chatId}/members`, { userId })
      setMembers(res.data.members || [])
      setQ('')
      setResults([])
      push({ type: 'success', message: 'Member added' })
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to add member' })
    } finally {
      setBusy(false)
    }
  }

  const removeMember = async (userId) => {
    setBusy(true)
    try {
      const res = await api.delete(`/api/chats/${chatId}/members/${userId}`)
      setMembers(res.data.members || [])
      push({ type: 'success', message: 'Member removed' })
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to remove member' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="page-title">
        <h1>{loading ? 'Group chat' : chat?.group_name || 'Group chat'}</h1>
        <div className="muted">Group ID: {chatId}</div>
      </div>

      {!loading && (
        <div className="card">
          <div className="col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="card-title">Group info</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                  Edit name/photo, manage members
                </div>
              </div>
              <button className="btn" onClick={load} disabled={busy || loading}>
                <span className="material-symbols-rounded">refresh</span> Refresh
              </button>
            </div>

            {myRole === 'admin' ? (
              <>
                <div className="col" style={{ gap: 6 }}>
                  <div className="label">Group name</div>
                  <input
                    className="input"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                <div className="col" style={{ gap: 6 }}>
                  <div className="label">Group photo</div>
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGroupPhoto(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={saveGroup} disabled={busy}>
                    <span className="material-symbols-rounded">save</span>{' '}
                    {busy ? 'Saving…' : 'Save group'}
                  </button>
                </div>
              </>
            ) : (
              <div className="muted" style={{ fontSize: 13 }}>
                Only admins can edit group info
              </div>
            )}

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="card-title">Members</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                  total: {members.length} 
                </div>
              </div>
            </div>

            {myRole === 'admin' && (
              <>
                <div className="col" style={{ gap: 6 }}>
                  <div className="label">Add members</div>
                  <input
                    className="input"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search users…"
                  />
                </div>

                {results.length > 0 && (
                  <div className="col">
                    {results.map((u) => (
                      <button
                        key={u.id}
                        className="btn"
                        onClick={() => addMember(u.id)}
                        disabled={busy}
                      >
                        <span className="row" style={{ gap: 10 }}>
                          <span className="material-symbols-rounded">person_add</span>
                          <span>
                            {u.username}{' '}
                            <span className="muted" style={{ fontSize: 12 }}>
                              ({u.email})
                            </span>
                          </span>
                        </span>
                        <span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>
                          Add
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="col" style={{ marginTop: 12 }}>
              {members.map((m) => (
                <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="row" style={{ gap: 10 }}>
                    <span className="material-symbols-rounded">
                      {m.role === 'admin' ? 'shield' : 'person'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {m.username}
                        {m.is_online && (
                          <span className="muted" style={{ marginLeft: 8, fontSize: 11 }}>
                            <span
                              className="material-symbols-rounded"
                              style={{ color: '#2bee79', fontSize: 14, verticalAlign: 'middle' }}
                            >
                              circle
                            </span>{' '}
                            online
                          </span>
                        )}
                      </div>
                      <div className="muted" style={{ fontSize: 12 }}>{m.username} ({m.role})</div>
                    </div>
                  </div>

                  {myRole === 'admin' && m.id !== me?.id && (
                    <button className="btn" onClick={() => removeMember(m.id)} disabled={busy}>
                      <span className="material-symbols-rounded">person_remove</span>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reuse the same chat UI */}
      <ChatPage />
    </div>
  )
}
