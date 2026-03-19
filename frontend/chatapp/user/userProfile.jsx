import './UserProfile.css'

function ProfileSection({ title, children }) {
  return (
    <div className="profile-section">
      <h4 className="section-title">{title}</h4>
      {children}
    </div>
  )
}

export function UserProfile() {

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Developer at Tech Company',
    photo: 'https://via.placeholder.com/200',
    online: true,
    mutualGroups: 5,
    notifications: true,
    darkMode: false
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-image">
          <img 
            src={user.photo} 
            alt={user.name} 
            className="profile-avatar"
          />
          {user.online && (
            <span className="online-status"></span>
          )}
        </div>
        <h3>{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <p className="user-bio">{user.bio}</p>
      </div>

      <ProfileSection title="Status">
        <p className="status-text">Active now</p>
      </ProfileSection>

      <ProfileSection title="Notifications">
        <label className="toggle-container">
          <input 
            type="checkbox" 
            checked={user.notifications}
            onChange={(e) => console.log('Notifications:', e.target.checked)}
          />
          <span className="toggle"></span>
          <span className="toggle-label">
            {user.notifications ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </ProfileSection>

      <ProfileSection title="Theme">
        <label className="toggle-container">
          <input 
            type="checkbox" 
            checked={user.darkMode}
            onChange={(e) => console.log('Dark mode:', e.target.checked)}
          />
          <span className="toggle"></span>
          <span className="toggle-label">
            {user.darkMode ? 'Dark' : 'Light'}
          </span>
        </label>
      </ProfileSection>

      <ProfileSection title="Mutual Groups">
        <p className="mutual-groups">{user.mutualGroups} mutual groups</p>
      </ProfileSection>

      <ProfileSection title="Actions">
        <button className="action-button">
          <span className="material-symbols-rounded">phone</span>
          Voice Call
        </button>
        <button className="action-button">
          <span className="material-symbols-rounded">video_call</span>
          Video Call
        </button>
        <button className="action-button">
          <span className="material-symbols-rounded">info</span>
          View Info
        </button>
      </ProfileSection>
    </div>
  )
}