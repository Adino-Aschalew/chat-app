import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function AddFriendModal({ onClose, onAddFriend }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('search')

  const suggestedUsers = [
    { id: 1, name: 'Alice Johnson', username: '@alice_j', avatar: 'https://picsum.photos/seed/alice/100/100', mutual: 12 },
    { id: 2, name: 'Bob Smith', username: '@bobsmith', avatar: 'https://picsum.photos/seed/bob/100/100', mutual: 5 },
    { id: 3, name: 'Carol Davis', username: '@carold', avatar: 'https://picsum.photos/seed/carol/100/100', mutual: 8 },
    { id: 4, name: 'David Wilson', username: '@davidw', avatar: 'https://picsum.photos/seed/david/100/100', mutual: 3 },
    { id: 5, name: 'Emma Brown', username: '@emma_b', avatar: 'https://picsum.photos/seed/emma/100/100', mutual: 15 }
  ]

  const searchResults = searchQuery 
    ? suggestedUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleAddFriend = (userData) => {
    const friendData = {
      name: userData.name,
      username: userData.username.replace('@', ''),
      avatar: userData.avatar
    }
    onAddFriend(friendData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Friend</h2>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="modal-body">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search
            </button>
            <button 
              className={`tab ${activeTab === 'suggested' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggested')}
            >
              Suggested
            </button>
          </div>

          {activeTab === 'search' && (
            <div className="form-section">
              <div className="search-container">
                <Icon name="search" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or username..."
                  autoFocus
                />
              </div>

              {searchQuery && (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div key={user.id} className="user-result">
                        <img src={user.avatar} alt={user.name} />
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-username">{user.username}</div>
                        </div>
                        <button 
                          className="add-btn"
                          onClick={() => handleAddFriend(user)}
                        >
                          <Icon name="person_add" />
                          Add
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <Icon name="search_off" />
                      <p>No users found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'suggested' && (
            <div className="form-section">
              <div className="suggested-users">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="suggested-user">
                    <div className="user-avatar">
                      <img src={user.avatar} alt={user.name} />
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-username">{user.username}</div>
                      <div className="mutual-friends">
                        <Icon name="people" />
                        {user.mutual} mutual friends
                      </div>
                    </div>
                    <button 
                      className="add-btn"
                      onClick={() => handleAddFriend(user)}
                    >
                      <Icon name="person_add" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
