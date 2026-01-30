import { NavLink, Outlet } from 'react-router-dom'
import './appShell.css'
import { useAuth } from '../../providers/AuthProvider'
import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function AppShell() {
  const { logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="container">
      <div className="app-grid">

        {/* MOBILE TOPBAR */}
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setDrawerOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="brand">
            <div className="brand-mark" />
            <div className="brand-name">ChatApp</div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark" />
            <div className="brand-name">ChatApp</div>
          </div>

          <nav className="nav">
            <NavLink className="nav-item" to="/home">
              <Icon name="chat" />
              Chats
            </NavLink>
            <NavLink className="nav-item" to="/contacts">
              <Icon name="person_search" />
              Contacts
            </NavLink>
            <NavLink className="nav-item" to="/profile">
              <Icon name="account_circle" />
              Profile
            </NavLink>
            <NavLink className="nav-item" to="/settings">
              <Icon name="settings" />
              Settings
            </NavLink>
          </nav>

          <button className="logout" onClick={logout}>
            <Icon name="logout" /> Logout
          </button>
        </aside>

        {/* MOBILE DRAWER */}
        <div className={`drawer ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
              <Icon name="close" />
            </button>

            <div className="brand" style={{ paddingTop: 40 }}>
              <div className="brand-mark" />
              <div className="brand-name">ChatApp</div>
            </div>

            <nav className="nav">
              <NavLink className="nav-item" to="/home" onClick={() => setDrawerOpen(false)}>
                <Icon name="chat" />
                Chats
              </NavLink>
              <NavLink className="nav-item" to="/contacts" onClick={() => setDrawerOpen(false)}>
                <Icon name="person_search" />
                Contacts
              </NavLink>
              <NavLink className="nav-item" to="/profile" onClick={() => setDrawerOpen(false)}>
                <Icon name="account_circle" />
                Profile
              </NavLink>
              <NavLink className="nav-item" to="/settings" onClick={() => setDrawerOpen(false)}>
                <Icon name="settings" />
                Settings
              </NavLink>
            </nav>

            <button className="logout" onClick={logout}>
              <Icon name="logout" /> Logout
            </button>
          </div>
        </div>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
