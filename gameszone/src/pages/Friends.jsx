import { Search, UserPlus, Gamepad2, MessageSquare, MoreVertical, Circle } from 'lucide-react';
import './Friends.css';

export default function Friends() {
  const friendsList = [
    { id: 1, name: 'Priya', avatar: 'P', status: 'online', game: 'Playing Chess', level: 16 },
    { id: 2, name: 'Arjun', avatar: 'A', status: 'online', game: 'In Lobby', level: 18 },
    { id: 3, name: 'Karthik', avatar: 'K', status: 'offline', game: 'Last seen 2h ago', level: 14 },
    { id: 4, name: 'Meera', avatar: 'M', status: 'offline', game: 'Last seen 5h ago', level: 13 },
    { id: 5, name: 'Vikram', avatar: 'V', status: 'online', game: 'Playing SQL Challenge', level: 21 },
    { id: 6, name: 'Neha', avatar: 'N', status: 'away', game: 'Away', level: 9 },
  ];

  return (
    <div className="friends-page">
      <div className="page-header">
        <div>
          <h1>Friends</h1>
          <p>Connect, challenge, and play with your friends.</p>
        </div>
        <button className="add-friend-btn">
          <UserPlus size={18} />
          <span>Add Friend</span>
        </button>
      </div>

      <div className="friends-toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search friends..." />
        </div>
        <div className="filter-tabs">
          <button className="tab active">All</button>
          <button className="tab">Online (3)</button>
          <button className="tab">Requests (1)</button>
        </div>
      </div>

      <div className="friends-grid">
        {friendsList.map(friend => (
          <div key={friend.id} className="friend-card">
            <div className="friend-header">
              <div className="friend-avatar-wrapper">
                <div className="friend-avatar">{friend.avatar}</div>
                <div className={`status-indicator ${friend.status}`}></div>
              </div>
              <button className="more-btn">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="friend-info">
              <h3>{friend.name}</h3>
              <span className="friend-level">Level {friend.level}</span>
              <p className={`friend-activity ${friend.status}`}>{friend.game}</p>
            </div>
            
            <div className="friend-actions">
              <button className="action-btn primary" disabled={friend.status === 'offline'}>
                <Gamepad2 size={16} />
                Challenge
              </button>
              <button className="action-btn secondary">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
