import React from "react";
import "./ProfileSetup.css";
import { Link } from "react-router";
export default function ProfileSetup() {
  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Top Bar */}
        <div className="top-bar">
          <span className="material-symbols-outlined back-icon">
            arrow_back_ios
          </span>
          <h2>Profile Setup</h2>
        </div>

        {/* Indicators */}
        <div className="page-indicators">
          <span className="dot inactive" />
          <span className="dot active" />
          <span className="dot inactive" />
        </div>

        {/* Heading */}
        <h3 className="title">Set up your profile</h3>
        <p className="subtitle">
          Let friends recognize you with a photo and bio.
        </p>

        {/* Photo Upload */}
        <div className="photo-section">
          <div className="photo-wrapper">
            <div className="photo-circle">
              <span className="material-symbols-outlined photo-icon">
                add_a_photo
              </span>
            </div>
            <div className="photo-add">
              <span className="material-symbols-outlined">add</span>
            </div>
          </div>

          <div className="photo-text">
            <p className="photo-title">Add Photo</p>
            <p className="photo-subtitle">Tap to upload your picture</p>
          </div>
        </div>

        {/* Bio */}
        <div className="bio-section">
          <label>Bio</label>
          <div className="bio-wrapper">
            <textarea
              placeholder="Tell the world what you're up to..."
              maxLength={150}
            />
            <span className="char-count">0 / 150</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="actions">
          <button className="primary-btn">
            <Link to='/welcome'>Continue</Link>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="secondary-btn">Skip for now</button>
        </div>

        {/* iOS Indicator */}
        <div className="ios-indicator" />
      </div>
    </div>
  );
}
