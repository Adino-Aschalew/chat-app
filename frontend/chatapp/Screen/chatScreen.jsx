import { useState } from 'react'
import './ChatScreen.css'

function Message({ message, isMe }) {
  return (
    <div className={`message ${isMe ? 'me' : 'other'}`}>
      <div className="message-content">
        {message.text}
        <span className="message-time">{message.time}</span>
      </div>
      {message.status && (
        <span className="message-status">{message.status}</span>
      )}
    </div>
  )
}

function InputBar({ onSend }) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="input-bar">
      <button className="attach-button">
        <span className="material-symbols-rounded">attach_file</span>
      </button>
      <div className="input-container">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
      </div>
      <button 
        className={`send-button ${input.trim() ? 'active' : ''}`}
        onClick={handleSend}
      >
        <span className="material-symbols-rounded">send</span>
      </button>
    </div>
  )
}

export function ChatScreen({ chat, onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey, how are you?",
      time: "12:34 PM",
      isMe: false,
      status: "delivered"
    },
    {
      id: 2,
      text: "I'm good, thanks! How about you?",
      time: "12:35 PM",
      isMe: true,
      status: "read"
    },
    {
      id: 3,
      text: "Doing well! Just wanted to check in.",
      time: "12:36 PM",
      isMe: false,
      status: "delivered"
    }
  ])


  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div className="chat-screen">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <div className="top-bar-info">
          <div className="user-avatar">
            <img 
              src={chat.photo || 'https://via.placeholder.com/40'} 
              alt={chat.name} 
              className="avatar"
            />
            {chat.online && (
              <span className="online-dot"></span>
            )}
          </div>
          <div className="user-info">
            <h3>{chat.name}</h3>
            <p className="user-status">Active now</p>
          </div>
        </div>
        <div className="top-bar-actions">
          <button className="action-button">
            <span className="material-symbols-rounded">phone</span>
          </button>
          <button className="action-button">
            <span className="material-symbols-rounded">video_call</span>
          </button>
          <button className="action-button">
            <span className="material-symbols-rounded">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map(message => (
          <Message 
            key={message.id} 
            message={message} 
            isMe={message.isMe}
          />
        ))}
      </div>

      {/* Input Bar */}
      <InputBar onSend={handleSend} />
    </div>
  )
}