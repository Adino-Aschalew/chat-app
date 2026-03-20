import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../providers/AuthProvider'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function UserProfile() {
  const { me } = useAuth() // Changed from 'user' to 'me'
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(false) // Start with false
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState({
    messages: true,
    groups: true,
    calls: false,
    stories: true
  })

  // Debug: log user state and auth context
  console.log('UserProfile - me from auth:', me)
  console.log('UserProfile - me object keys:', me ? Object.keys(me) : 'null')

  // Set profile data based on authentication state
  useEffect(() => {
    console.log('UserProfile - useEffect triggered, me:', me)
    if (me) {
      console.log('UserProfile - User is authenticated, setting profile data')
      // User is authenticated, use real data
      setProfileData({
        name: me.name || me.username || 'My Profile',
        email: me.email || 'user@example.com',
        username: me.username || 'username',
        profilePhoto: me.profile_photo || me.photo || null,
        status: me.status || 'Available',
        createdAt: me.created_at || new Date().toISOString()
      })
    } else {
      console.log('UserProfile - User not authenticated, setting default data')
      // User not authenticated, show default profile
      setProfileData({
        name: 'My Profile',
        email: 'user@example.com',
        username: 'username',
        profilePhoto: null,
        status: 'Available',
        createdAt: new Date().toISOString()
      })
    }
    setLoading(false)
    console.log('UserProfile - Profile data set:', profileData)
  }, [me])

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <div className="profile-content">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
      </div>
    )
  }

  // Always show the profile, even if profileData is null (use defaults)
  return (
    <div className="profile-content">
      {/* Profile Header */}
      <div className="profile-section">
        <div className="profile-avatar-large">
          <img 
            src={profileData?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || 'User')}&background=random&size=200`}
            alt={profileData?.name || 'Profile'}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || 'User')}&background=random&size=200`
            }}
          />
          <button className="camera-btn">
            <Icon name="camera_alt" />
          </button>
        </div>
        <div className="profile-name-section">
          <h2>{profileData?.name || 'My Profile'}</h2>
          <p className="profile-status">{profileData?.status || 'Available'}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-section">
        <div className="profile-info-item">
          <label>Name</label>
          <input type="text" defaultValue={profileData?.name || ''} />
        </div>
        <div className="profile-info-item">
          <label>Username</label>
          <input type="text" defaultValue={profileData?.username || ''} />
        </div>
        <div className="profile-info-item">
          <label>Email</label>
          <input type="text" defaultValue={profileData?.email || ''} />
        </div>
        <div className="profile-info-item">
          <label>Status</label>
          <input type="text" defaultValue={profileData?.status || 'Available'} />
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
