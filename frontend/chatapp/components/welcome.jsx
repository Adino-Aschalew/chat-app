import React from "react";
import "./Welcome.css";
import { Link } from "react-router";
export default function Welcome() {
  return (
    <div className="welcome-page">
      {/* Header */}
      <header className="welcome-header">
        <div className="spacer" />
        <h2 className="app-title">ChatApp</h2>
        <span className="material-symbols-outlined menu-icon">
          more_horiz
        </span>
      </header>

      <main className="welcome-main">
        {/* Illustration */}
        <div className="illustration-wrapper">
          <div className="illustration-circle">
            <div className="illustration-bg" />
            <div
              className="illustration-image"
              aria-label="People connecting through chat"
            />
          </div>
        </div>

        {/* Headline */}
        <div className="headline">
          <h1>Welcome to ChatApp!</h1>
          <p>
            Connect instantly with friends and family across the globe.
          </p>
        </div>

        {/* Features */}
        <div className="features">
          <Feature
            icon="bolt"
            title="Real-time messaging"
            desc="Connect instantly with zero latency."
          />
          <Feature
            icon="verified_user"
            title="Secure encryption"
            desc="Your conversations are always private."
          />
          <Feature
            icon="share"
            title="Media sharing"
            desc="Share photos and videos seamlessly."
          />
        </div>

        {/* CTA */}
        <div className="cta">
          <div className="dots">
            <span />
            <span />
            <span className="active" />
          </div>

          <button className="start-btn">
            <Link to ='/chatList'>Start Chatting</Link></button>
          <div className="home-indicator-space" />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature">
      <div className="feature-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="feature-title">{title}</p>
        <p className="feature-desc">{desc}</p>
      </div>
    </div>
  );
}
