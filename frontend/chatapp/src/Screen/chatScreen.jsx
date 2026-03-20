import { useState, useRef, useEffect } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function ChatScreen({ chat, onBack, onShowRightPanel, onMessageSent }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hey! How are you doing?',
      sent: false,
      time: '2:30 PM',
      status: 'read'
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some new features.",
      sent: true,
      time: '2:32 PM',
      status: 'read'
    },
    {
      id: 3,
      text: 'That sounds interesting! What are you building?',
      sent: false,
      time: '2:33 PM',
      status: 'delivered'
    },
    {
      id: 4,
      text: 'A WhatsApp-style chat application with React',
      sent: true,
      time: '2:35 PM',
      status: 'sent'
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      }
      setMessages([...messages, newMessage])
      
      // Update chat list with latest message
      if (onMessageSent) {
        onMessageSent({
          chatId: chat.id,
          lastMessage: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      }
      
      setMessage('')
      
      // Simulate typing indicator and response
      setTimeout(() => setIsTyping(true), 1000)
      setTimeout(() => {
        setIsTyping(false)
        const response = {
          id: messages.length + 2,
          text: 'That sounds amazing! Keep up the great work!',
          sent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        }
        setMessages(prev => [...prev, response])
        
        // Update chat list with response message
        if (onMessageSent) {
          onMessageSent({
            chatId: chat.id,
            lastMessage: 'That sounds amazing! Keep up the great work!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })
        }
      }, 3000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Icon name="check" />
      case 'delivered':
        return <Icon name="done_all" />
      case 'read':
        return <Icon name="done_all" style={{ color: '#25D366' }} />
      default:
        return null
    }
  }

  return (
    <>
      {/* Chat Header */}
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          <Icon name="arrow_back" />
        </button>
        
        <div className="chat-user-info" onClick={onShowRightPanel}>
          <div className="chat-user-avatar">
            <img 
              src={chat.user?.avatar || 'https://picsum.photos/100/100'} 
              alt={chat.user?.name || chat.name}
            />
          </div>
          <div className="chat-user-details">
            <h3>{chat.user?.name || chat.name}</h3>
            <p className="status">
              {chat.user?.online ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="chat-actions">
          <button className="chat-action-btn">
            <Icon name="videocam" />
          </button>
          <button className="chat-action-btn">
            <Icon name="call" />
          </button>
          <button 
            className="chat-action-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon name="more_vert" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sent ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              <div className="message-meta">
                <span>{msg.time}</span>
                {msg.sent && (
                  <div className="message-status">
                    {getStatusIcon(msg.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message received">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span>typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Three-dot Menu */}
      {showMenu && (
        <div className="chat-menu" onClick={() => setShowMenu(false)}>
          <div className="chat-menu-content" onClick={(e) => e.stopPropagation()}>
            <button className="chat-menu-item">
              <Icon name="block" />
              <span>Block Contact</span>
            </button>
            <button className="chat-menu-item">
              <Icon name="delete" />
              <span>Delete Chat</span>
            </button>
            <button className="chat-menu-item">
              <Icon name="palette" />
              <span>Change Theme</span>
            </button>
            <button className="chat-menu-item">
              <Icon name="image" />
              <span>View Media</span>
            </button>
            <button className="chat-menu-item">
              <Icon name="link" />
              <span>View Links</span>
            </button>
            <button className="chat-menu-item">
              <Icon name="description" />
              <span>View Documents</span>
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="message-input-container">
        <div className="message-input-wrapper">
          <div className="message-input-actions">
            <button className="input-action-btn">
              <Icon name="emoji_emotions" />
            </button>
            <button className="input-action-btn">
              <Icon name="attach_file" />
            </button>
          </div>
          
          <textarea
            ref={inputRef}
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            style={{
              resize: 'none',
              overflow: 'hidden',
              minHeight: '32px',
              maxHeight: '120px',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onInput={(e) => {
              // Reset height first
              e.target.style.height = '32px'
              // Set new height based on scrollHeight
              const newHeight = Math.min(Math.max(e.target.scrollHeight, 32), 120)
              e.target.style.height = newHeight + 'px'
            }}
          />
          
          <button 
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    </>
  )
}
