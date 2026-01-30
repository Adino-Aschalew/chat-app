import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './chat.css';
import { Link } from 'react-router-dom';
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'
import { useSocket } from '../providers/SocketProvider'
import { useAuth } from '../providers/AuthProvider'

export function ChatPage() {
  const { chatId } = useParams()
  const { me } = useAuth()
  const { push } = useToast()
  const { socket } = useSocket()

  const [messages, setMessages] = useState([]) // newest-first from API
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const typingTimeoutRef = useRef(null)
  const messageAreaRef = useRef(null)

  const reactionOptions = ['👍', '❤️', '😂', '🎉','👌', '🙌', '😎', '🌹', '🎂']

  const fmtTime = (isoOrDate) => {
    const d = new Date(isoOrDate)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const previews = useMemo(
    () =>
      files.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
        url: URL.createObjectURL(f),
      })),
    [files],
  )

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const load = async ({ beforeId } = {}) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/chats/${chatId}/messages`, {
        params: { limit: 30, ...(beforeId ? { beforeId } : {}) },
      })
      const rows = res.data.messages || []
      setMessages((cur) => (beforeId ? [...cur, ...rows] : rows))
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to load messages' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    if (!socket) return
    socket.emit('join_chat', { chatId: Number(chatId) })

    const onNew = (payload) => {
      if (String(payload?.chatId) !== String(chatId)) return
      setMessages((cur) => [payload.message, ...cur])
    }

    const onTyping = ({ chatId: cId, userId, isTyping, userName }) => {
      if (String(cId) !== String(chatId)) return
      if (userId === me?.id) return
      if(isTyping && userName){
        push({type: 'info', message: `${userName} is typing...`})
      }
      setTypingUsers((cur) => {
        const next = { ...cur }
        if (isTyping) next[userId] = true
        else delete next[userId]
        return next
      })
    }

    const onRead = ({ messageId }) => {
      setMessages((cur) => cur.map((m) => (m.id === messageId ? { ...m, status: 'read' } : m)))
    }

    socket.on('new_message', onNew)
    socket.on('typing', onTyping)
    socket.on('read_message', onRead)
    socket.on('message_reacted', ({ messageId, reactions }) => {
      setMessages((cur) =>
        cur.map((m) => (m.id === messageId ? { ...m, reactions: reactions || [] } : m)),
      )
    })

    return () => {
      socket.emit('leave_chat', { chatId: Number(chatId) })
      socket.off('new_message', onNew)
      socket.off('typing', onTyping)
      socket.off('read_message', onRead)
      socket.off('message_reacted')
    }
  }, [chatId, socket,me, push])

  const typingLabel = useMemo(() => {
    const ids = Object.keys(typingUsers)
    if (ids.length === 0) return ''
    return ids.length === 1 ? 'Someone is typing…' : 'Multiple people are typing…'
  }, [typingUsers])

  const emitTyping = (isTyping) => {
    if (!socket) return
    socket.emit('typing', { chatId: Number(chatId), isTyping })
  }

  const onChangeText = (v) => {
    setText(v)
    emitTyping(true)
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = window.setTimeout(() => emitTyping(false), 800)
  }

  const onSend = async () => {
    if (sending) return
    if (!text.trim() && files.length === 0) return
    setSending(true)
    try {
      const fd = new FormData()
      if (text.trim()) fd.append('text', text.trim())
      for (const f of files) fd.append('files', f)
      const res = await api.post(`/api/chats/${chatId}/messages`, fd)

      const msg = res.data.message
      setMessages((cur) => {
        if (cur.some((m) => m.id === msg.id)) return cur
        return [msg, ...cur]
      })
      setText('')
      setFiles([])
      emitTyping(false)
    } catch (err) {
      push({ type: 'error', message: err?.response?.data?.message || 'Failed to send message' })
    } finally {
      setSending(false)
    }
  }

  const onLoadMore = async () => {
    const oldest = messages[messages.length - 1]
    if (!oldest) return
    await load({ beforeId: oldest.id })
  }

  useEffect(() => {
    if (!messages.length || !me) return
    const newest = messages[0]
    if (!newest) return
    if (newest.sender_id === me.id) return
    if (newest.status === 'read') return

    ;(async () => {
      try {
        await api.put(`/api/messages/${newest.id}/read`)
        socket?.emit('read_message', { chatId: Number(chatId), messageId: newest.id })
      } catch {
        // ignore
      }
    })()
  }, [messages, me, socket, chatId])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = messageAreaRef.current
    if (!el) return
    // small delay to allow layout to settle
    window.requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [messages])

  return (
    <div className="wa-layout">
      <main className="wa-main">
        <div className="chat-screen">
      <div className="chat-header">
        <button className="icon-btn">
          <Link to='/chats'>
          <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </button>

        <div className="chat-user">
          <div className="chat-avatar" />
          <div className="chat-user-info">
            <h2>Chat {chatId}</h2>
            <p>
              <span className="typing-dot" /> {typingLabel || 'Online'}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <span className="material-symbols-outlined">call</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      <div className="message-area" ref={messageAreaRef}>
        <button className="btn" onClick={onLoadMore} disabled={loading || messages.length === 0}>
          <span className="material-symbols-rounded">expand_more</span> Load older
        </button>

        {loading ? (
          <div className="muted">Loading…</div>
        ) : (
          [...messages].reverse().map((m) => {
            const mine = me && m.sender_id === me.id
            return (
              <div key={m.id} className={`chat-bubble ${mine ? 'sent' : 'received'}`}>
                {!mine ? <div className="bubble-avatar" /> : null}

                <div className="bubble-content">
                  {m.body ? <div className="bubble-text">{m.body}</div> : null}

                  {Array.isArray(m.media) && m.media.length > 0 ? (
                    <div className="bubble-image" style={{ backgroundImage: `url(${m.media[0].url_path})` }} />
                  ) : null}

                  <div className="bubble-meta">
                    <span className="bubble-time">{fmtTime(m.created_at) || `#${m.id}`}</span>
                    {mine && m.status === 'read' ? <span className="seen">• Read</span> : null}
                  </div>

                  <div className="msg-reactions">
                    {(m.reactions || []).map((r) => (
                      <span key={r.reaction} className="reaction-pill">
                        {r.reaction} {r.count}
                      </span>
                    ))}

                    <div className="row" style={{ gap: 4 }}>
                      {reactionOptions.map((r) => (
                        <button
                          key={r}
                          className="reaction-btn"
                          onClick={async () => {
                            try {
                              const res = await api.post(`/api/messages/${m.id}/react`, { reaction: r })
                              setMessages((cur) =>
                                cur.map((msg) => (msg.id === m.id ? { ...msg, reactions: res.data.reactions || [] } : msg)),
                              )
                            } catch {
                              push({ type: 'error', message: 'Failed to react' })
                            }
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {mine ? <div className="bubble-avatar" /> : null}
              </div>
            )
          })
        )}
      </div>

      {previews.length > 0 && (
        <div className="chat-previews">
          {previews.map((p) => (
            <div key={p.url} className="preview">
              {p.type.startsWith('image/') ? (
                <img src={p.url} alt={p.name} />
              ) : p.type.startsWith('video/') ? (
                <video src={p.url} controls />
              ) : (
                <div className="file">
                  <span className="material-symbols-rounded">attach_file</span>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {p.name}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button style={{ color: '#000000' }} className="btn" onClick={() => setFiles([])}>
            Clear
          </button>
        </div>
      )}

      <div className="chat-input">
        <div className="left-actions">
          <label className="icon-btn" style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{color: '#000000'}}>attach_file</span>
            <input
              style={{ display: 'none' }}
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </label>
        </div>

        <div className="input-wrap">
          <textarea
          value={text}
           onChange={(e) => onChangeText(e.target.value)}
  placeholder="Message…"
  className="chat-textarea"
/>
          <button className="emoji-btn">
            <span className="material-symbols-outlined">emoji_emotions</span>
          </button>
        </div>

        <button className="send-btn" onClick={onSend} disabled={sending}>
          <span className="material-symbols-outlined">send</span>
        </button>
        </div>
      </div>
      </main>
    </div>
  )
}
