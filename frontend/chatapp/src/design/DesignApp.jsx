import React from 'react'
import './styles/design.css'

const ChatListItem = ({name, last, time, unread, online, avatar}) => (
  <div className="chat-item">
    <div className="chat-avatar">
      <img src={avatar} alt="a"/>
      {online && <span className="online-dot"/>}
    </div>
    <div className="chat-meta">
      <div className="chat-top">
        <div className="chat-name">{name}</div>
        <div className="chat-time">{time}</div>
      </div>
      <div className="chat-last">{last} {unread && <span className="unread-dot"/>}</div>
    </div>
  </div>
)

const Message = ({side='left', text, time, avatar, type}) => (
  <div className={`msg-row ${side==='right'?'right':'left'}`}>
    {side==='left' && <div className="msg-avatar"><img src={avatar} alt="a"/></div>}
    <div className={`msg-bubble ${side==='left'?'incoming':'sent'}`}>
      {type==='reply' && <div className="reply-quote">Replying to: Hey, that works great!</div>}
      <div>{text}</div>
      <div className="msg-meta">
        <div className="muted">{time}</div>
        {side==='right' && <div className="tick double"/>}
      </div>
    </div>
  </div>
)

export default function DesignApp(){
  const avatar='https://images.unsplash.com/photo-1545996124-8f7f4d3b7d4f?w=200&h=200&fit=crop'
  return (
    <div className="design-frame">
      <div className="phone">
        <div className="app-header">
          <div className="title">Chats</div>
          <div className="search muted">Search</div>
        </div>
        <div className="app-body">
          <div className="sidebar">
            <div className="chat-list">
              <ChatListItem name="Alice" last="Hey, are you free tonight?" time="9:21" unread online avatar={avatar} />
              <ChatListItem name="Group: Designers" last="Liam: Sent a photo" time="8:02" avatar={avatar} />
              <ChatListItem name="Bob" last="Typing..." time="7:45" online avatar={avatar} />
              <div className="typing-bar"><div className="typing-bubble"><div className="dots"><span></span><span></span><span></span></div></div></div>
            </div>

            <div style={{height:420}} className="chat-screen">
              <div className="messages">
                <Message side="left" text="Hey! Here's the photo from earlier." time="9:10" avatar={avatar} />
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                  <div className="msg-bubble sent" style={{maxWidth:220}}>
                    <div className="media-preview"><img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop" alt="m"/></div>
                    <div className="msg-meta"><div className="muted">9:12</div><div className="tick double"/></div>
                  </div>
                </div>
                <Message side="right" text="Awesome, thanks!" time="9:13"/>
                <div className="msg-row left"><div className="msg-avatar"><img src={avatar} alt="a"/></div>
                  <div className="msg-bubble incoming">
                    <div>Also, check this voice note.</div>
                    <div className="waveform"><div className="bar"/><div className="bar"/><div className="bar"/><div className="bar"/><div className="bar"/></div>
                    <div className="msg-meta"><div className="muted">9:14</div></div>
                  </div>
                </div>
              </div>
              <div className="input-bar">
                <button className="emoji-btn">😀</button>
                <div className="input"><input placeholder="Message"/></div>
                <button className="btn">➤</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
