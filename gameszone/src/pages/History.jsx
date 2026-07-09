import { History as HistoryIcon, Target, Clock, Trophy, XCircle } from 'lucide-react';
import './History.css';

export default function History() {
  const matchHistory = [
    { id: 1, game: 'Chess', type: 'Ranked Match', opponent: 'Priya', result: 'win', score: '+15 XP', date: 'Today, 2:30 PM', duration: '15m 24s' },
    { id: 2, game: 'SQL Challenge', type: 'Daily Puzzle', opponent: null, result: 'win', score: '+50 XP', date: 'Today, 10:15 AM', duration: '5m 12s' },
    { id: 3, game: 'Python Quiz', type: 'Speed Run', opponent: null, result: 'loss', score: '0 XP', date: 'Yesterday, 8:45 PM', duration: '2m 30s' },
    { id: 4, game: 'Chess', type: 'Friendly Match', opponent: 'Arjun', result: 'draw', score: '+5 XP', date: 'Yesterday, 6:00 PM', duration: '22m 10s' },
    { id: 5, game: 'Typing Test', type: 'Practice', opponent: null, result: 'win', score: '85 WPM', date: 'Oct 12, 11:20 AM', duration: '1m 00s' },
    { id: 6, game: 'SQL Challenge', type: 'Ranked', opponent: null, result: 'win', score: '+30 XP', date: 'Oct 10, 9:00 AM', duration: '8m 45s' },
  ];

  const getResultIcon = (result) => {
    switch (result) {
      case 'win': return <Trophy size={18} />;
      case 'loss': return <XCircle size={18} />;
      case 'draw': return <Target size={18} />;
      default: return null;
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Game History</h1>
          <p>Review your past matches and performance.</p>
        </div>
        <div className="history-stats">
          <div className="h-stat">
            <span className="h-label">Matches</span>
            <span className="h-value">142</span>
          </div>
          <div className="h-stat">
            <span className="h-label">Win Rate</span>
            <span className="h-value">68%</span>
          </div>
          <div className="h-stat">
            <span className="h-label">Time Played</span>
            <span className="h-value">42h</span>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <button className="filter-btn active">All Games</button>
        <button className="filter-btn">Chess</button>
        <button className="filter-btn">SQL Challenge</button>
        <button className="filter-btn">Python Quiz</button>
      </div>

      <div className="history-list">
        {matchHistory.map(match => (
          <div key={match.id} className={`history-card result-${match.result}`}>
            <div className="hc-icon">
              {getResultIcon(match.result)}
            </div>
            
            <div className="hc-main">
              <div className="hc-title-row">
                <h4>{match.game}</h4>
                <span className={`result-badge ${match.result}`}>{match.result.toUpperCase()}</span>
              </div>
              <div className="hc-details">
                <span className="match-type">{match.type}</span>
                {match.opponent && (
                  <>
                    <span className="dot">•</span>
                    <span className="opponent">vs {match.opponent}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="hc-meta">
              <div className="hc-score">{match.score}</div>
              <div className="hc-time-info">
                <span className="date">{match.date}</span>
                <span className="dot">•</span>
                <span className="duration"><Clock size={12} /> {match.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="load-more-container">
        <button className="load-more-btn">Load Older Matches</button>
      </div>
    </div>
  );
}
