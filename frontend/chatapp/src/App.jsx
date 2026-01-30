import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import { AppProviders } from './providers/AppProviders'
import { AppShell } from './ui/layout/AppShell'
import { RequireAuth } from './routes/RequireAuth'

import { WelcomePage } from './pages/WelcomePage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { ContactsPage } from './pages/ContactsPage'
import { GroupCreatePage } from './pages/GroupCreatePage'
import { GroupChatPage } from './pages/GroupChatPage'
import { MediaGalleryPage } from './pages/MediaGalleryPage'

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/chats/:chatId" element={<ChatPage />} />
          <Route path="/groups/new" element={<GroupCreatePage />} />
          <Route path="/groups/:chatId" element={<GroupChatPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/media/:chatId" element={<MediaGalleryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  )
}