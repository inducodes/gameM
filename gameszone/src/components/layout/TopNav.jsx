import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import './TopNav.css';

export default function TopNav() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from document
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="topnav">
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search games, players, topics..." className="search-input" />
      </div>

      <div className="topnav-actions">
        
        <button className="icon-btn notif-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="stats-container">
          <div className="stat-badge coin-badge">
            <div className="badge-icon coin">🪙</div>
            <span className="mono">1250</span>
          </div>
          <div className="stat-badge xp-badge">
            <div className="badge-icon star">⭐</div>
            <span>XP <span className="mono">890</span></span>
          </div>
          <div className="stat-badge level-badge">
            <div className="badge-icon purple-hex">⬢</div>
            <span>Level <span className="mono">12</span></span>
          </div>
        </div>

        <div className="profile-container">
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=Sriram&background=4F46E5&color=fff" alt="Sriram" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Sriram</span>
            <span className="dropdown-icon">⌄</span>
          </div>
        </div>

        <button className="icon-btn theme-btn" onClick={toggleTheme}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
      </div>
    </header>
  );
}
