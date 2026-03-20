import { useState, useEffect } from 'react'
import axios from 'axios'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function ChatList({ onSelectChat, activeTab, searchQuery, chats, setChats }) {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch chats from backend
  useEffect(() => {
    if (chats.length === 0) {
      fetchChats()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchChats = async () => {
    try {
      setLoading(true)
      // Fetch users from backend
      const usersResponse = await axios.get('http://localhost:4000/api/users/all')
      const users = usersResponse.data.users || []
      
      // Transform users into chat format
      const userChats = users.map(user => ({
        id: user.id,
        name: user.username,
        username: user.username,
        avatar: user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`,
        lastMessage: 'No messages yet',
        time: 'Just now',
        unread: Math.floor(Math.random() * 5), // Random unread count for demo
        online: user.is_online, // Use actual online status from backend
        status: user.is_online ? 'online' : 'offline', // Set status based on is_online
        isGroup: false
      }))
      
      // Mock group chats
      const groupChats = [
        {
          id: 1001,
          name: 'Team Chat',
          username: null,
          avatar: 'https://picsum.photos/seed/team/100/100',
          lastMessage: 'John: Great work everyone!',
          time: '12:45 PM',
          unread: 5,
          online: true,
          status: 'group',
          isGroup: true
        },
        {
          id: 1002,
          name: 'Project Updates',
          username: null,
          avatar: 'https://picsum.photos/seed/project/100/100',
          lastMessage: 'New milestone completed',
          time: 'Yesterday',
          unread: 0,
          online: false,
          status: 'group',
          isGroup: true
        },
        {
          id: 1003,
          name: 'Dev Team',
          username: null,
          avatar: 'https://picsum.photos/seed/devteam/100/100',
          lastMessage: 'Sarah: Code review done',
          time: '9:30 AM',
          unread: 0,
          online: false,
          status: 'group',
          isGroup: true
        }
      ]
      
      // Combine fetched data with existing chats
      const allChats = [...userChats, ...groupChats, ...chats]
      // Remove duplicates by ID
      const uniqueChats = allChats.filter((chat, index, self) => 
        index === self.findIndex(c => c.id === chat.id)
      )
      setChats(uniqueChats)
      setError(null)
    } catch (err) {
      setError('Failed to load chats')
      console.error('Error fetching chats:', err)
      // Fallback to mock data if backend fails
      const fallbackChats = [
        {
          id: 1,
          name: 'Alice Johnson',
          username: 'alice_johnson',
          avatar: 'https://picsum.photos/seed/alice/100/100',
          lastMessage: 'Hey! How are you doing?',
          time: '2:30 PM',
          unread: 2,
          online: true,
          status: 'online',
          isGroup: false
        },
        {
          id: 2,
          name: 'Bob Smith',
          username: 'bob_smith',
          avatar: 'https://picsum.photos/seed/bob/100/100',
          lastMessage: 'Can we schedule a meeting?',
          time: '1:15 PM',
          unread: 0,
          online: false,
          status: 'offline',
          isGroup: false
        }
      ]
      setChats(fallbackChats)
    } finally {
      setLoading(false)
    }
  }

  // Filter chats based on active tab and search query
  const filteredChats = chats.filter(chat => {
    const matchesSearch = searchQuery === '' || 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.username && chat.username.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (!matchesSearch) return false
    
    switch (activeTab) {
      case 'unread':
        return chat.unread > 0
      case 'groups':
        return chat.isGroup
      case 'all':
      default:
        return true
    }
  })

  const handleChatClick = (chat) => {
    setSelectedChatId(chat.id)
    onSelectChat(chat)
  }

  const formatTime = (time) => {
    return time
  }

  if (loading) {
    return (
      <div className="user-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading chats...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-list">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchChats} className="retry-btn">Retry</button>
        </div>
      </div>
    )
  }

  if (filteredChats.length === 0) {
    return (
      <div className="user-list">
        <div className="empty-state">
          <div className="empty-icon">
            <span className="material-symbols-rounded">
              {activeTab === 'unread' ? 'mark_email_unread' : activeTab === 'groups' ? 'group' : 'search'}
            </span>
          </div>
          <h3>No {activeTab === 'unread' ? 'unread' : activeTab === 'groups' ? 'groups' : 'chats'} found</h3>
          <p>
            {searchQuery ? 'Try a different search term' : 
             activeTab === 'unread' ? 'All messages have been read' :
             activeTab === 'groups' ? 'No groups available' :
             'Start a new conversation'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-list">
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          className={`user-item ${selectedChatId === chat.id ? 'selected' : ''}`}
          onClick={() => handleChatClick(chat)}
        >
          <div className="user-avatar">
            <img 
              src={chat.avatar} 
              alt={chat.name}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`
              }}
            />
            {!chat.isGroup && (
              <div className={`online-status ${chat.status === 'offline' ? 'offline' : chat.status === 'away' ? 'away' : ''}`}></div>
            )}
          </div>
          
          <div className="user-info">
            <div className="user-name">{chat.name}</div>
            <div className="last-message">{chat.lastMessage}</div>
          </div>
          
          <div className="user-meta">
            <div className="message-time">{formatTime(chat.time)}</div>
            {chat.unread > 0 && (
              <div className="unread-count">{chat.unread}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
