import { useState } from 'react'

function Icon({ name }) {
  return <span className="material-symbols-rounded">{name}</span>
}

export function CreateGroupModal({ onClose }) {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [groupImage, setGroupImage] = useState(null)
  const [step, setStep] = useState(1)

  const mockUsers = [
    { id: 1, name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/alice/100/100' },
    { id: 2, name: 'Bob Smith', avatar: 'https://picsum.photos/seed/bob/100/100' },
    { id: 3, name: 'Carol Davis', avatar: 'https://picsum.photos/seed/carol/100/100' },
    { id: 4, name: 'David Wilson', avatar: 'https://picsum.photos/seed/david/100/100' },
    { id: 5, name: 'Emma Brown', avatar: 'https://picsum.photos/seed/emma/100/100' }
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      console.log('Creating group:', {
        name: groupName,
        description: groupDescription,
        members: selectedMembers,
        image: groupImage
      })
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        {step === 1 && (
          <div className="modal-body">
            <div className="form-section">
              <label>Group Name *</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                maxLength={25}
              />
            </div>

            <div className="form-section">
              <label>Group Description</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="What's this group about?"
                rows={3}
                maxLength={100}
              />
            </div>

            <div className="form-section">
              <label>Group Image</label>
              <div className="image-upload">
                <div className="image-preview">
                  {groupImage ? (
                    <img src={groupImage} alt="Group" />
                  ) : (
                    <div className="image-placeholder">
                      <Icon name="group" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="group-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="upload-btn"
                  onClick={() => document.getElementById('group-image').click()}
                >
                  <Icon name="camera_alt" />
                  Choose Photo
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => setStep(2)}
                disabled={!groupName.trim()}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-body">
            <div className="form-section">
              <label>Add Members ({selectedMembers.length} selected)</label>
              <div className="members-list">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`member-item ${selectedMembers.includes(user.id) ? 'selected' : ''}`}
                    onClick={() => toggleMember(user.id)}
                  >
                    <img src={user.avatar} alt={user.name} />
                    <span>{user.name}</span>
                    <div className="checkbox">
                      {selectedMembers.includes(user.id) && <Icon name="check" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCreateGroup}
                disabled={selectedMembers.length === 0}
              >
                Create Group ({selectedMembers.length + 1} members)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
