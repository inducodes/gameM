import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gamepad2, Trophy, Medal, History, Users, Settings } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', name: 'Dashboard', icon: Home },
  { path: '/games', name: 'Games', icon: Gamepad2 },
  { path: '/leaderboard', name: 'Leaderboard', icon: Trophy },
  { path: '/achievements', name: 'Achievements', icon: Medal },
  { path: '/history', name: 'Game History', icon: History },
  { path: '/friends', name: 'Friends', icon: Users },
  { path: '/settings', name: 'Settings', icon: Settings },
];

export default function Sidebar({ isCollapsed }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img 
            src="/logo.png" 
            alt="Vidhya Sethu Game Zone" 
            className={`sidebar-logo-img ${isCollapsed ? 'collapsed' : ''}`}
            onError={(e) => {
              // Fallback if image isn't loaded yet
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-fallback" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
            <div className="logo-icon">VS</div>
            {!isCollapsed && <span className="logo-text">Vidhya Sethu</span>}
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <div className="nav-icon-container">
                  <item.icon className="nav-icon" size={24} />
                </div>
                {!isCollapsed && <span className="nav-label">{item.name}</span>}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="active-indicator"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
