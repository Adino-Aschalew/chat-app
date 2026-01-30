import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import './toast.css'

const ToastContext = createContext(null)

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const push = useCallback((toast) => {
    const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
    const item = { id, type: toast?.type || 'info', message: toast?.message || '' }
    setToasts((t) => [item, ...t].slice(0, 4))
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, toast?.durationMs || 2600)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-dot" />
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export { ToastProvider, useToast }

