import { Link } from 'react-router-dom'
import './../../components/welcome.css';

export function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* Header */}
      <header className="welcome-header">
        <span className="material-symbols-outlined menu-icon">menu</span>
        <div className="app-title">ChatApp</div>
        <div className="spacer" />
      </header>

      {/* Main */}
      <main className="welcome-main">
        {/* Illustration */}
        <div className="illustration-wrapper">
          <div className="illustration-circle">
            <div className="illustration-bg" />
            <div className="illustration-image" />
          </div>
        </div>

        {/* Headline */}
        <section className="headline">
          <h1>Chat smarter.</h1>
          <p>
            Real-time messaging with media, groups, typing indicators, and read
            receipts.
          </p>
        </section>

        {/* Features */}
        <section className="features">
          <div className="feature">
            <div className="feature-icon">
              <span className="material-symbols-outlined">chat</span>
            </div>
            <div>
              <div className="feature-title">Instant messaging</div>
              <div className="feature-desc">
                Fast, reliable real-time conversations.
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <div className="feature-title">Groups & media</div>
              <div className="feature-desc">
                Share photos, videos, and chat in groups.
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <span className="material-symbols-outlined">done_all</span>
            </div>
            <div>
              <div className="feature-title">Read receipts</div>
              <div className="feature-desc">
                Know when your messages are seen.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="dots">
            <span className="active" />
            <span />
            <span />
          </div>

          <Link to="/register" className="start-btn">
            Get started
          </Link>

          <Link to="/login" className="muted">
            I already have an account
          </Link>

          <div className="home-indicator-space" />
        </section>
      </main>
    </div>
  )
}
