import React from "react";
import "./Auth.css";
import Register from "./register";
import {Link} from 'react-router';
export default function Auth() {
  return (
    <div className="auth-page">
      {/* Top Bar */}
      <div className="top-bar">
        <span className="material-symbols-outlined close-icon">close</span>
        <h2>Connect With The World!</h2>
      </div>

      <div className="auth-container">
        {/* Left Section */}
        <div className="auth-left">
          <div className="gradient-box">
            <div className="gradient-content">
              <h1>Connect with the future of chat.</h1>
              <p>Experience lightning-fast communication on any device.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue chatting with your team.</p>
            </div>

            <form className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="name@company.com" />
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>
                  <a href="#">Forgot?</a>
                </div>
                <input type="password" placeholder="••••••••" />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="keep" />
                <label htmlFor="keep">Keep me logged in</label>
              </div>

              <button className="primary-btn">Sign In</button>
            </form>

            <p className="switch-auth">
              Don’t have an account?
              <Link to='/register'> Sign Up</Link>
            </p>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google
              </button>
              <button>
                <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" alt="Apple" />
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
