import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function ChatList({ onSelectChat }) {
  const [selectedChatId, setSelectedChatId] = useState(null)

  // Mock data for demonstration
  const chats = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: 'https://picsum.photos/seed/alice/100/100',
      lastMessage: 'Hey! How are you doing?',
      time: '2:30 PM',
      unread: 2,
      online: true,
      status: 'online'
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar: 'https://picsum.photos/seed/bob/100/100',
      lastMessage: 'Can we schedule a meeting?',
      time: '1:15 PM',
      unread: 0,
      online: false,
      status: 'offline'
    },
    {
      id: 3,
      name: 'Team Chat',
      avatar: 'https://picsum.photos/seed/team/100/100',
      lastMessage: 'John: Great work everyone!',
      time: '12:45 PM',
      unread: 5,
      online: true,
      status: 'group',
      isGroup: true
    },
    {
      id: 4,
      name: 'Carol Davis',
      avatar: 'https://picsum.photos/seed/carol/100/100',
      lastMessage: 'Thanks for the help!',
      time: '11:30 AM',
      unread: 1,
      online: true,
      status: 'away'
    },
    {
      id: 5,
      name: 'Project Updates',
      avatar: 'https://picsum.photos/seed/project/100/100',
      lastMessage: 'New milestone completed',
      time: 'Yesterday',
      unread: 0,
      online: false,
      status: 'group',
      isGroup: true
    }
  ]

  const handleChatClick = (chat) => {
    setSelectedChatId(chat.id)
    onSelectChat(chat)
  }

  const formatTime = (time) => {
    return time
  }

  return (
    <div className="user-list">
      {chats.map((chat) => (
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
