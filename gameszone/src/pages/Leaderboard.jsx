import { useState } from 'react';
import { Trophy, Medal, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { leaderboardData } from '../mockData';
import './Leaderboard.css';

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <div>
          <h1>Leaderboard</h1>
          <p>See where you stand among top players.</p>
        </div>
        <div className="timeframe-selector">
          <button 
            className={`tf-btn ${timeframe === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeframe('daily')}
          >
            Daily
          </button>
          <button 
            className={`tf-btn ${timeframe === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`tf-btn ${timeframe === 'all-time' ? 'active' : ''}`}
            onClick={() => setTimeframe('all-time')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="top-three-podium">
        {/* Rank 2 */}
        <div className="podium-item rank-2">
          <div className="podium-avatar">
            <span>{leaderboardData[1].avatar}</span>
            <div className="rank-badge">2</div>
          </div>
          <div className="podium-info">
            <h4>{leaderboardData[1].name}</h4>
            <p>{leaderboardData[1].xp} XP</p>
          </div>
          <div className="podium-base"></div>
        </div>

        {/* Rank 1 */}
        <div className="podium-item rank-1">
          <div className="crown"><Trophy size={24} color="#fbbf24" fill="#fbbf24" /></div>
          <div className="podium-avatar">
            <span>{leaderboardData[0].avatar}</span>
            <div className="rank-badge">1</div>
          </div>
          <div className="podium-info">
            <h4>{leaderboardData[0].name}</h4>
            <p>{leaderboardData[0].xp} XP</p>
          </div>
          <div className="podium-base"></div>
        </div>

        {/* Rank 3 */}
        <div className="podium-item rank-3">
          <div className="podium-avatar">
            <span>{leaderboardData[2].avatar}</span>
            <div className="rank-badge">3</div>
          </div>
          <div className="podium-info">
            <h4>{leaderboardData[2].name}</h4>
            <p>{leaderboardData[2].xp} XP</p>
          </div>
          <div className="podium-base"></div>
        </div>
      </div>

      <div className="leaderboard-list">
        <div className="list-header">
          <div className="col-rank">Rank</div>
          <div className="col-player">Player</div>
          <div className="col-level">Level</div>
          <div className="col-xp">XP</div>
        </div>
        {leaderboardData.map((player) => (
          <div key={player.rank} className={`list-row ${player.isCurrent ? 'current-player' : ''}`}>
            <div className="col-rank">
              <span className={`rank-number r-${player.rank}`}>{player.rank}</span>
            </div>
            <div className="col-player">
              <div className="player-avatar">{player.avatar}</div>
              <span className="player-name">{player.name}</span>
            </div>
            <div className="col-level">
              <span className="level-badge">Lvl {player.level}</span>
            </div>
            <div className="col-xp">
              <Star size={16} className="xp-icon" />
              <span>{player.xp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
