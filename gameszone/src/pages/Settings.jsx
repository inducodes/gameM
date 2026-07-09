import { User, Bell, Shield, Monitor, Key, LogOut } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and configurations.</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button className="settings-tab active">
            <User size={18} />
            <span>Profile</span>
          </button>
          <button className="settings-tab">
            <Monitor size={18} />
            <span>Appearance</span>
          </button>
          <button className="settings-tab">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button className="settings-tab">
            <Shield size={18} />
            <span>Privacy</span>
          </button>
          <button className="settings-tab">
            <Key size={18} />
            <span>Security</span>
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h2>Profile Information</h2>
            <div className="profile-edit-card">
              <div className="profile-avatar-large">S</div>
              <div className="profile-edit-actions">
                <button className="btn-primary">Change Avatar</button>
                <button className="btn-secondary">Remove</button>
              </div>
            </div>

            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue="Sriram" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="sriram@example.com" />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea rows="3" defaultValue="Passionate gamer and coding enthusiast."></textarea>
              </div>
              <div className="form-actions">
                <button className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="settings-section">
            <h2>Danger Zone</h2>
            <div className="danger-zone-card">
              <div className="dz-info">
                <h4>Delete Account</h4>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
