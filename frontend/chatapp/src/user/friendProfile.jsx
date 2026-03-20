import { useState, useEffect } from 'react'
import axios from 'axios'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function FriendProfile({ user }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const displayUser = profileData || user // Use user as fallback immediately
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  console.log('FriendProfile - user prop:', user)
  console.log('FriendProfile - profileData:', profileData)
  console.log('FriendProfile - displayUser:', displayUser)
  console.log('FriendProfile - loading:', loading)

  // Fetch detailed user profile from backend
  useEffect(() => {
    console.log('FriendProfile - useEffect triggered, user:', user)
    if (user && user.id) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      console.log('FriendProfile - Fetching profile for user ID:', user.id)
      
      const response = await axios.get(`http://localhost:4000/api/users/${user.id}/public`)
      const userData = response.data.user
      
      console.log('FriendProfile - Backend response:', userData)
      
      setProfileData({
        ...user,
        ...userData,
        mutualGroups: [
          { id: 1, name: 'Team Chat', memberCount: 5 },
          { id: 2, name: 'Project Updates', memberCount: 3 }
        ],
        sharedMedia: [
          { id: 1, type: 'image', url: 'https://picsum.photos/seed/friend1/100/100', sentAt: '2 hours ago' },
          { id: 2, type: 'image', url: 'https://picsum.photos/seed/friend2/100/100', sentAt: '1 day ago' }
        ]
      })
      setError(null)
    } catch (err) {
      console.error('FriendProfile - Error fetching user profile:', err)
      setError('Failed to load user profile')
      setProfileData({
        ...user,
        mutualGroups: [
          { id: 1, name: 'Team Chat', memberCount: 5 }
        ],
        sharedMedia: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Don't show loading/error states initially - show the user profile right away
  if (loading && !user) {
    return (
      <div className="profile-content">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="profile-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchUserProfile} className="retry-btn">Retry</button>
        </div>
      </div>
    )
  }

  if (!displayUser) {
    return (
      <div className="profile-content">
        <div className="empty-profile">
          <Icon name="person" />
          <p>Select a chat to view profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-content">
      {/* Profile Header */}
      <div className="profile-section">
        <div className="profile-avatar-large">
          <img 
            src={displayUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser.name)}&background=random&size=200`}
            alt={displayUser.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser.name)}&background=random&size=200`
            }}
          />
          <div className={`online-indicator ${user.online ? 'online' : 'offline'}`}></div>
        </div>
        <div className="profile-name-section">
          <h2>{displayUser.name}</h2>
          <p className="profile-status">
            {displayUser.online ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="profile-section">
        <h3>Contact Information</h3>
        <div className="profile-info-item">
          <label>Username</label>
          <p>{displayUser.username || '@username'}</p>
        </div>
        <div className="profile-info-item">
          <label>Email</label>
          <p>{displayUser.email || 'user@example.com'}</p>
        </div>
        <div className="profile-info-item">
          <label>Status</label>
          <p>{displayUser.status || 'Available'}</p>
        </div>
      </div>

      {/* Mutual Groups */}
      {displayUser.mutualGroups && (
        <div className="profile-section">
          <h3>Mutual Groups</h3>
          <div className="groups-list">
            {displayUser.mutualGroups.map((group) => (
              <div key={group.id} className="group-item">
                <Icon name="group" />
                <div className="group-info">
                  <span className="group-name">{group.name}</span>
                  <span className="group-members">{group.members} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
