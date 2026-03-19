import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function FriendProfile({ user }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!user) {
    return (
      <div className="profile-content">
        <div className="empty-profile">
          <Icon name="person" />
          <p>Select a chat to view profile</p>
        </div>
      </div>
    )
  }

  const mutualGroups = [
    { id: 1, name: 'Team Chat', members: 12 },
    { id: 2, name: 'Project Updates', members: 8 },
    { id: 3, name: 'Weekend Plans', members: 5 }
  ]

  return (
    <div className="profile-content">
      {/* Profile Header */}
      <div className="profile-section">
        <div className="profile-avatar-large">
          <img 
            src={user.avatar || 'https://picsum.photos/seed/friend/200/200'} 
            alt={user.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`
            }}
          />
          <div className={`online-indicator ${user.online ? 'online' : 'offline'}`}></div>
        </div>
        <div className="profile-name-section">
          <h2>{user.name}</h2>
          <p className="profile-status">
            {user.online ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="profile-section">
        <h3>Contact Information</h3>
        <div className="contact-item">
          <Icon name="phone" />
          <span>+1 234 567 8900</span>
        </div>
        <div className="contact-item">
          <Icon name="email" />
          <span>{user.name.toLowerCase().replace(' ', '.')}@example.com</span>
        </div>
        <div className="contact-item">
          <Icon name="location_on" />
          <span>San Francisco, CA</span>
        </div>
      </div>

      {/* Mutual Groups */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Mutual Groups</h3>
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? 'expand_less' : 'expand_more'} />
          </button>
        </div>
        <div className={`mutual-groups ${isExpanded ? 'expanded' : ''}`}>
          {mutualGroups.map((group) => (
            <div key={group.id} className="mutual-group-item">
              <div className="group-avatar">
                <img src={`https://picsum.photos/seed/${group.name}/50/50`} alt={group.name} />
              </div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-members">{group.members} members</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Shared */}
      <div className="profile-section">
        <h3>Media Shared</h3>
        <div className="media-grid">
          <div className="media-item">
            <img src="https://picsum.photos/seed/media1/100/100" alt="Media" />
          </div>
          <div className="media-item">
            <img src="https://picsum.photos/seed/media2/100/100" alt="Media" />
          </div>
          <div className="media-item">
            <img src="https://picsum.photos/seed/media3/100/100" alt="Media" />
          </div>
          <div className="media-item more">
            <div className="more-count">+15</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-section">
        <button className="profile-action-btn primary">
          <Icon name="chat" />
          Message
        </button>
        <button className="profile-action-btn">
          <Icon name="call" />
          Voice Call
        </button>
        <button className="profile-action-btn">
          <Icon name="videocam" />
          Video Call
        </button>
        <button className="profile-action-btn">
          <Icon name="info" />
          View Contact
        </button>
        <button className="profile-action-btn danger">
          <Icon name="block" />
          Block
        </button>
      </div>
    </div>
  )
}
