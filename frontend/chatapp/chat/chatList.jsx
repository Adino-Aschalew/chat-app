import { useState } from 'react'
import './ChatList.css'

function ChatItem({ chat, onSelect }) {
  return (
    <div 
      className="chat-item" 
      onClick={() => onSelect(chat)}
    >
      <div className="chat-avatar">
        <img 
          src={chat.photo || 'https://via.placeholder.com/40'} 
          alt={chat.name} 
          className="avatar"
        />
        {chat.online && (
          <span className="online-dot"></span>
        )}
      </div>
      <div className="chat-info">
        <div className="chat-header">
          <h4>{chat.name}</h4>
          {chat.unread && (
            <span className="unread-badge">{chat.unread}</span>
          )}
        </div>
        <p className="chat-preview">{chat.lastMessage}</p>
        <span className="chat-time">{chat.time}</span>
      </div>
    </div>
  )
}

export function ChatList({ onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState('')

  const chats = [
    {
      id: 1,
      name: 'John Doe',
      photo: 'https://via.placeholder.com/40',
      online: true,
      lastMessage: 'Hey, how are you?',
      time: '12:34 PM',
      unread: 2
    },
    {
      id: 2,
      name: 'Jane Smith',
      photo: 'https://via.placeholder.com/40',
      online: false,
      lastMessage: 'I\'ll be there in 10 minutes',
      time: '11:22 AM',
      unread: 0
    },
    {
      id: 3,
      name: 'Work Group',
      photo: 'https://via.placeholder.com/40',
      online: false,
      lastMessage: 'New project update',
      time: '10:15 AM',
      unread: 5
    }
  ]

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="chat-list">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search chats..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="chats-container">
        {filteredChats.map(chat => (
          <ChatItem 
            key={chat.id} 
            chat={chat} 
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </div>
  )
}