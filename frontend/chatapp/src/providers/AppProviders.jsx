import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import { SocketProvider } from './SocketProvider'
import { useNotifications } from '../hooks/useNotifications'

function NotificationsWrapper({ children }) {
  useNotifications()
  return children
}

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationsWrapper>{children}</NotificationsWrapper>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

