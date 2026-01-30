import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthProvider'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token, isAuthed } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!isAuthed || !token) return

    const s = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000', {
      auth: { token },
      transports: ['websocket'],
    })
    socketRef.current = s

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.disconnect()
      socketRef.current = null
    }
  }, [isAuthed, token])

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
    }),
    [connected],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}

