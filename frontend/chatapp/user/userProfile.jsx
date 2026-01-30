import React from "react";
import "./UserProfile.css";
import { Link } from "react-router";
export default function UserProfile() {
  return (
    <div className="profile-page">
      {/* Top Nav */}
      <header className="top-nav">
        <div className="nav-inner">
          <button className="nav-back">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span>Settings</span>
          </button>

          <h2 className="nav-title">Profile</h2>

          <div className="nav-right">
            <button className="nav-edit">Edit</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="avatar-wrap">
            <div className="avatar-border">
              <div
                className="avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbTXCXrSi0JQ7C8VVMsKjMgZbgpeb6vtg4lU4hgYmDI02jUfC30bCY_0c51KSHde6GBiaiZaebjLSUBZfdsox5C-vO90PM2NdpiFpkJSPO3V-3uwzS-ZobPimrEBJr-ruEQGFxyo3azWai2EB6QPBMzyzC23f1Qxua3htGL0rV55VlFIfcY1gWvonet3qS4ok2AcPzeArViHk5GcYMbYVU70_tXtzLAxQD2_LSINvzuZt8fBSIb8VK8kEpiZ3VBq_jrjoK2VnKimnK")',
                }}
              />
            </div>

            <button className="avatar-edit">
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>

          <div className="user-info">
            <h1>Alex Johnson</h1>
            <p>Hey there! I am using ChatApp</p>

            <div className="online">
              <span className="online-dot" />
              <span>Online</span>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section className="info-section">
          <h3>Account Information</h3>

          <div className="info-card">
            <InfoRow icon="alternate_email" label="Username" value="@alex_j" />
            <InfoRow icon="mail" label="Email" value="alex@example.com" />
            <InfoRow icon="call" label="Phone Number" value="+1 (555) 902-3412" />
          </div>
        </section>

        {/* Privacy & Media */}
        <section className="info-section">
          <h3>Privacy & Media</h3>
         <Link to='/settings'>
          <div className="info-card">
            <ActionRow icon="lock" label="Privacy Settings" />
            <ActionRow icon="photo_library" label="Media & Storage" />
          </div>
         </Link>
        </section>

        {/* Actions */}
        <section className="action-section">
          <button className="logout-btn">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>

          <button className="delete-btn">Delete Account</button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavItem icon="chat_bubble" label="Chats" />
        <NavItem icon="call" label="Calls" />
        <NavItem icon="groups" label="Groups" />
        <NavItem icon="person" label="Profile" active />
      </nav>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <button className="info-row">
      <div className="info-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="info-text">
        <p className="info-label">{label}</p>
        <p className="info-value">{value}</p>
      </div>
      <span className="material-symbols-outlined chevron">chevron_right</span>
    </button>
  );
}

function ActionRow({ icon, label }) {
  return (
    <button className="info-row">
      <div className="info-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="info-text">
        <p className="action-label">{label}</p>
      </div>
      <span className="material-symbols-outlined chevron">chevron_right</span>
    </button>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}
