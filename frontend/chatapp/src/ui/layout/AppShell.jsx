import { NavLink } from 'react-router-dom'
import './appShell.css'
import { useAuth } from '../../providers/AuthProvider'
import { useState } from 'react'
import { ChatList } from '../../chat/chatList'
import { UserProfile } from '../../user/userProfile'
import { FriendProfile } from '../../user/friendProfile'
import { ChatScreen } from '../../Screen/chatScreen'
import { CreateGroupModal } from '../../components/LeftPanel/CreateGroupModal'
import { AddFriendModal } from '../../components/LeftPanel/AddFriendModal'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function AppShell() {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    setShowRightPanel(true)
  }

  const handleBack = () => {
    setSelectedChat(null)
    setShowRightPanel(false)
    setFabOpen(false)
  }

  const handleFabClick = () => {
    setFabOpen(!fabOpen)
  }

  const handleCreateGroup = () => {
    console.log('Create group clicked')
    setFabOpen(false)
    setShowCreateGroupModal(true)
  }

  const handleAddFriend = () => {
    console.log('Add friend clicked')
    setFabOpen(false)
    setShowAddFriendModal(true)
  }

  return (
    <div className="container">
      <div className="app-grid">
        {/* LEFT PANEL (25%) */}
        <aside className={`left-panel ${!selectedChat ? 'open' : ''}`}>
          <div className="search-bar">
            <div className="search-input">
              <Icon name="search" />
              <input 
                type="text" 
                placeholder="Search or start new chat..." 
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
          </div>

          <div className="tabs">
            <NavLink 
              to="/home" 
              className={({ isActive }) => isActive ? 'tab-item tab-item-active' : 'tab-item'}
              onClick={() => setSelectedChat(null)}
            >
              ALL
            </NavLink>
            <NavLink 
              to="/home" 
              className={({ isActive }) => isActive ? 'tab-item tab-item-active' : 'tab-item'}
              onClick={() => setSelectedChat(null)}
            >
              UNREAD
              <span className="unread-badge">3</span>
            </NavLink>
            <NavLink 
              to="/home" 
              className={({ isActive }) => isActive ? 'tab-item tab-item-active' : 'tab-item'}
              onClick={() => setSelectedChat(null)}
            >
              GROUPS
            </NavLink>
          </div>

          <ChatList onSelectChat={handleChatSelect} />
        </aside>

        {/* CENTER PANEL (50%) */}
        <main className="center-panel">
          {selectedChat ? (
            <ChatScreen 
              chat={selectedChat} 
              onBack={handleBack} 
              onShowRightPanel={() => setShowRightPanel(true)}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Icon name="chat" />
              </div>
              <h3>Select a chat to start messaging</h3>
              <p>Choose from your contacts or groups</p>
            </div>
          )}
        </main>

        {/* RIGHT PANEL (25%) */}
        <aside className="right-panel visible">
          <div className="right-panel-header">
            <button 
              className="back-button mobile-back" 
              onClick={handleBack}
            >
              <Icon name="arrow_back" />
            </button>
            <div className="profile-info">
              <div className="profile-image">
                <img 
                  src={user?.photo || 'https://via.placeholder.com/40'} 
                  alt={user?.name || 'Profile'}
                  className="avatar"
                />
              </div>
              <div className="profile-details">
                <h4>{user?.name || 'My Profile'}</h4>
                <p className="status">Active now</p>
              </div>
            </div>
          </div>

          {selectedChat ? (
            <FriendProfile user={selectedChat.user} />
          ) : (
            <UserProfile />
          )}
        </aside>

        {/* FAB BUTTONS */}
        <div className={`fab-container ${fabOpen ? 'active' : ''}`}>
          <button className="fab-main" onClick={handleFabClick}>
            <Icon name="add" />
          </button>
          <div className={`fab-options ${fabOpen ? 'active' : ''}`}>
            <button className="fab-option" onClick={handleCreateGroup}>
              <Icon name="group" />
              <span className="fab-label">Create Group</span>
            </button>
            <button className="fab-option" onClick={handleAddFriend}>
              <Icon name="person_add" />
              <span className="fab-label">Add Friend</span>
            </button>
          </div>
        </div>

        {/* FAB MODALS */}
        {showCreateGroupModal && (
          <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
        )}
        {showAddFriendModal && (
          <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
        )}
      </div>
    </div>
  )
}