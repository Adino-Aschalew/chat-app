import React from "react";
import "./ChatScreen.css";

export default function ChatScreen() {
  return (
    <div className="chat-screen">
      {/* Header */}
      <header className="chat-header">
        <button className="icon-btn">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>

        <div className="chat-user">
          <div className="chat-avatar" />
          <div className="chat-user-info">
            <h2>Alex Johnson</h2>
            <p>
              <span className="typing-dot" />
              Typing...
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="message-area">
        <div className="date-separator">TODAY</div>

        <ChatBubble
          type="received"
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0nQq7TqKZ12H20Xgi5OngDEGKd_zjdkJIVSk58j5r87Ievvhm2Yxv8UCIECFu9AtAlGJLRwlZ9L6k6Cd4_MjKY7KhuvT0gMPignBiwPLK-0-F63p_BZm-iTl8WVgmeSPkz7iItVamKrsQsUHoyxAVk2PLY76BeqgkNoqBLDtyOElVvVeJabvSUzebLrJoorOnmcCNqdJdw9lPdwrOMmUCvZtUmdcIAiONMNla0no-J02bOgDLIcSWQee1k5x2QcYNwW2Hx-9WBmv"
          message="Hey! Did you see the latest designs I pushed to the repository?"
          time="10:42 AM"
        />

        <ChatBubble
          type="sent"
          message="Not yet, let me check them out now. Are they in the UI/UX branch?"
          time="10:43 AM"
          seen
        />

        <ChatBubble
          type="received"
          avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuABNDA2VAQUSCjNv6Jh2bL9EaHIWFzlcSAIoE6kubWiNziAy3yxIGjffTe7yr88PQwnbgfDf8Snn6vTo4FjJbbwYlT1sFlO55eUlnSSg3QG2bQYT1eBEMYJWnWUz5mSUrx0guUF1T-nH2QfVKkD4czQ_XylT6WuKacvEDlpdRLiOqTupNHhi5ofj9jC6HqmgMRWnnE1Zj3IeeEqbIpuhlirtGNR00aDx6S2nXa1gkCZnU46WCa_V7VgoPw-hXNS4djDTR2-Q-WlZ0XR"
          message="Yeah! I think the green accent (#2bee79) looks great on the dark mode variation."
          time="10:45 AM"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2JAPVFs0SEcrKgedK7NWeAxYi8vyfIsBnRtO1iG3Tkh9cSTZNPrRG1ZA4NUuXbn6ugOK0f3f7eiE3gqPRE2BhUvw7PvKQ6LHtTpAnM-pMkuEUK5Mn8a4qqmLUXhTgajlfsPd9Ms7leC5lW6sdd5JAR_EQcjANpMyp1QmqRZcVIt_5Dr-CpRpoLfmg_q1jTY9ksJ7Jz4as7YDbTbKWKGc0i_U4XDlurMyTbrvozYipG5rBXEEBKWWcyo2i-LObzEJlzAsTlZf9JQj"
        />

        <ChatBubble
          type="sent"
          message="Agreed! It pops perfectly."
          time="10:46 AM"
          seen
        />
      </main>

      {/* Input */}
      <footer className="chat-input">
        <div className="left-actions">
          <button className="icon-btn">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">image</span>
          </button>
        </div>

        <div className="input-wrap">
          <input placeholder="Type a message..." />
          <button className="emoji-btn">
            <span className="material-symbols-outlined">mood</span>
          </button>
        </div>

        <button className="send-btn">
          <span className="material-symbols-outlined">send</span>
        </button>
      </footer>
    </div>
  );
}

function ChatBubble({ type, avatar, message, time, seen, image }) {
  const isSent = type === "sent";
  return (
    <div className={`chat-bubble ${isSent ? "sent" : "received"}`}>
      {!isSent && (
        <div
          className="bubble-avatar"
          style={{ backgroundImage: `url(${avatar})` }}
        />
      )}

      <div className="bubble-content">
        <div className="bubble-text">{message}</div>

        {image && (
          <div
            className="bubble-image"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        <div className="bubble-meta">
          <span className="time">{time}</span>
          {seen && <span className="material-symbols-outlined seen">done_all</span>}
        </div>
      </div>
    </div>
  );
}
