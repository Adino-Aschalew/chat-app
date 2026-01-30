import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import './../../Auth/auth.css'
import { api } from '../api/client'
import { useToast } from '../providers/ToastProvider'

export function MediaGalleryPage() {
  const { chatId } = useParams()
  const { push } = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/api/chats/${chatId}/messages`, { params: { limit: 100 } })
        if (!cancelled) setMessages(res.data.messages || [])
      } catch (err) {
        push({ type: 'error', message: err?.response?.data?.message || 'Failed to load media' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [chatId,push])

  const media = useMemo(() => {
    const out = []
    for (const m of messages) {
      for (const x of m.media || []) out.push({ ...x, messageId: m.id })
    }
    return out
  }, [messages])

  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="page-title">
        <h1>Media gallery</h1>
        <div className="muted">Chat #{chatId}</div>
      </div>
      <div className="card">
        {loading ? (
          <div className="muted">Loading…</div>
        ) : media.length === 0 ? (
          <div className="muted">No media yet.</div>
        ) : (
          <div className="col">
            {media.map((x) =>
              x.media_type === 'image' ? (
                <img
                  key={x.id}
                  src={base + x.url_path}
                  alt={x.original_name || 'image'}
                  style={{ width: '100%', borderRadius: 14, border: '1px solid var(--border)' }}
                />
              ) : x.media_type === 'video' ? (
                <video
                  key={x.id}
                  controls
                  src={base + x.url_path}
                  style={{ width: '100%', borderRadius: 14, border: '1px solid var(--border)' }}
                />
              ) : (
                <a key={x.id} href={base + x.url_path} target="_blank" rel="noreferrer" className="btn" style={{ justifyContent: 'space-between' }}>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="material-symbols-rounded">attach_file</span>
                    <span>
                      {x.original_name || 'file'}
                      <span className="muted" style={{ marginLeft: 10, fontSize: 12 }}>
                        msg #{x.messageId}
                      </span>
                    </span>
                  </span>
                  <span className="material-symbols-rounded">open_in_new</span>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

