import React from "react";
import "./Register.css";
import { Link } from "react-router";

export default function Register() {
  return (
    <div className="register-page">
      <div className="status-bar" />

      <main className="register-container">
        {/* Progress */}
        <div className="progress-section">
          <div className="progress-header">
            <p>Step 1 of 2</p>
            <span>50% Complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <p className="progress-label">Personal Details</p>
        </div>

        {/* Heading */}
        <h1 className="title">Join the Conversation</h1>
        <p className="subtitle">
          Create an account to start chatting with your friends in real-time.
        </p>

        {/* Form */}
        <form className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="e.g. Alex Johnson" />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <input type="email" placeholder="name@example.com" />
              <span className="material-symbols-outlined success">
                check_circle
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input type="password" placeholder="Min. 8 characters" />
              <button type="button" className="icon-btn">
                <span className="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>

          <button className="primary-btn" type="submit">
            <Link to='/profileSetUp'>Create Account</Link>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          <span>Already have an account?</span>
          <a href="#">Log In</a>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>
            By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </p>
        </footer>
      </main>

      <div className="home-indicator" />
    </div>
  );
}
