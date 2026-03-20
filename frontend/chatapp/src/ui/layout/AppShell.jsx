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
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState([])

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

  const handleCreateGroup = (groupData) => {
    // Add new group to chats list
    const newGroup = {
      id: Date.now(), // temporary ID
      name: groupData.name,
      username: null,
      avatar: groupData.image || `https://picsum.photos/seed/${groupData.name}/100/100`,
      lastMessage: 'Group created',
      time: 'Just now',
      unread: 0,
      online: false,
      status: 'group',
      isGroup: true,
      members: groupData.members || []
    }
    setChats(prev => [newGroup, ...prev])
    setShowCreateGroupModal(false)
  }

  const handleCreateGroupClick = () => {
    console.log('Create group clicked')
    setFabOpen(false)
    setShowCreateGroupModal(true)
  }

  const handleAddFriendToList = (friendData) => {
    // Add new friend to chats list
    const newFriend = {
      id: Date.now(), // temporary ID
      name: friendData.name,
      username: friendData.username,
      avatar: friendData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friendData.name)}&background=random`,
      lastMessage: 'Just added as friend',
      time: 'Just now',
      unread: 0,
      online: false, // Default to offline until backend updates
      status: 'offline', // Default to offline
      isGroup: false
    }
    setChats(prev => [newFriend, ...prev])
    setShowAddFriendModal(false)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleAddFriend = () => {
    console.log('Add friend clicked')
    setFabOpen(false)
    setShowAddFriendModal(true)
    // New code here
    console.log('New code executed')
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setSelectedChat(null)
  }

  const handleMessageSent = ({ chatId, lastMessage, time }) => {
    // Update the chat list with the new message
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage, time, unread: chat.unread + 1 }
        : chat
    ))
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
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="tabs">
            <button 
              className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabClick('all')}
            >
              ALL
            </button>
            <button 
              className={`tab-item ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => handleTabClick('unread')}
            >
              UNREAD
              <span className="unread-badge">3</span>
            </button>
            <button 
              className={`tab-item ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => handleTabClick('groups')}
            >
              GROUPS
            </button>
          </div>

          <ChatList 
            onSelectChat={handleChatSelect} 
            activeTab={activeTab} 
            searchQuery={searchQuery}
            chats={chats}
            setChats={setChats}
          />
        </aside>

        {/* CENTER PANEL (50%) */}
        <main className="center-panel">
          {selectedChat ? (
            <ChatScreen 
              chat={selectedChat} 
              onBack={handleBack} 
              onShowRightPanel={() => setShowRightPanel(true)}
              onMessageSent={handleMessageSent}
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
                  src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=40`} 
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
            <FriendProfile user={selectedChat} />
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
            <button className="fab-option" onClick={handleCreateGroupClick}>
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
          <CreateGroupModal 
            onClose={() => setShowCreateGroupModal(false)} 
            onCreateGroup={handleCreateGroup}
          />
        )}
        {showAddFriendModal && (
          <AddFriendModal 
            onClose={() => setShowAddFriendModal(false)} 
            onAddFriend={handleAddFriendToList}
          />
        )}
      </div>
    </div>
  )
}