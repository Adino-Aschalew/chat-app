import { useEffect } from 'react'
import { useSocket } from '../providers/SocketProvider'
import { useAuth } from '../providers/AuthProvider'

export function useNotifications() {
  const { socket } = useSocket()
  const { me } = useAuth()

  useEffect(() => {
    if (!socket || !me || typeof window === 'undefined' || !('Notification' in window)) return

    // Respect saved setting (set by Settings page). Default true.
    const enabled = localStorage.getItem('notifications_enabled')
    if (enabled === '0') return

    // Request permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const onNewMessage = ({ chatId, message }) => {
      if (!message || message.sender_id === me.id) return
      if (Notification.permission !== 'granted') return

      const text = message.body || 'Sent a media file'
      new Notification(`New message in chat #${chatId}`, {
        body: text.length > 60 ? text.slice(0, 60) + '...' : text,
        icon: '/vite.svg',
        tag: `chat-${chatId}`,
      })
    }

    socket.on('new_message', onNewMessage)

    return () => {
      socket.off('new_message', onNewMessage)
    }
  }, [socket, me])
}
