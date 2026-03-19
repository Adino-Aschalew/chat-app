import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function UserProfile() {
  const [notifications, setNotifications] = useState({
    messages: true,
    groups: true,
    calls: false,
    stories: true
  })

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="profile-content">
      {/* Profile Header */}
      <div className="profile-section">
        <div className="profile-avatar-large">
          <img 
            src="https://picsum.photos/seed/myprofile/200/200" 
            alt="My Profile"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=Me&background=random&size=200`
            }}
          />
          <button className="camera-btn">
            <Icon name="camera_alt" />
          </button>
        </div>
        <div className="profile-name-section">
          <h2>My Profile</h2>
          <p className="profile-status">Active now</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-section">
        <div className="profile-info-item">
          <label>Name</label>
          <input type="text" defaultValue="John Doe" />
        </div>
        <div className="profile-info-item">
          <label>Email</label>
          <input type="email" defaultValue="john.doe@example.com" />
        </div>
        <div className="profile-info-item">
          <label>Bio</label>
          <textarea 
            placeholder="Write something about yourself..."
            defaultValue="Hey there! I'm using this chat app."
          />
        </div>
      </div>

      {/* Stories Section */}
      <div className="profile-section">
        <h3>My Stories</h3>
        <div className="stories-grid">
          <div className="story-item">
            <div className="story-avatar">
              <img src="https://picsum.photos/seed/story1/100/100" alt="Story" />
              <div className="story-add">
                <Icon name="add" />
              </div>
            </div>
            <span>Add Story</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="profile-section">
        <h3>Notifications</h3>
        <div className="notification-item">
          <div className="notification-info">
            <Icon name="message" />
            <span>Messages</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.messages}
              onChange={() => handleNotificationToggle('messages')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <div className="notification-info">
            <Icon name="group" />
            <span>Groups</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.groups}
              onChange={() => handleNotificationToggle('groups')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <div className="notification-info">
            <Icon name="call" />
            <span>Calls</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.calls}
              onChange={() => handleNotificationToggle('calls')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <div className="notification-info">
            <Icon name="auto_stories" />
            <span>Stories</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.stories}
              onChange={() => handleNotificationToggle('stories')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-section">
        <button className="profile-action-btn">
          <Icon name="settings" />
          Settings
        </button>
        <button className="profile-action-btn">
          <Icon name="privacy_tip" />
          Privacy
        </button>
        <button className="profile-action-btn danger">
          <Icon name="logout" />
          Logout
        </button>
      </div>
    </div>
  )
}
