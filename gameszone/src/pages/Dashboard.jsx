import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Star, Flame, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { statsData, leaderboardData, activityFeed, achievementsData } from '../mockData';
import './Dashboard.css';

const getIcon = (label) => {
  switch(label) {
    case 'Games Played': return <Gamepad2 size={24} />;
    case 'Games Won': return <Trophy size={24} />;
    case 'XP': return <Star size={24} />;
    case 'Coins': return <div className="coin-icon">C</div>;
    case 'Daily Streak': return <Flame size={24} />;
    case 'Level': return <div className="level-icon">L</div>;
    default: return <Star size={24} />;
  }
};

const getColor = (label) => {
  switch(label) {
    case 'Games Played': return '#5a5ce5';
    case 'Games Won': return '#f59e0b';
    case 'XP': return '#8b5cf6';
    case 'Coins': return '#eab308';
    case 'Daily Streak': return '#ef4444';
    case 'Level': return '#10B981';
    default: return '#5a5ce5';
  }
};

export default function Dashboard() {
  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="dashboard-grid">
        
        <div className="dashboard-main">
          {/* Personal Leaderboard View */}
          <div className="personal-leaderboard glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2><Trophy size={24} color="#f59e0b" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}/> Your Rank</h2>
            </div>
            
            <div className="rank-highlight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
              <div className="current-rank" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="rank-badge" style={{ background: 'var(--gradient-primary)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}>
                  #5
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>Sriram</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={16} color="#8b5cf6" /> 890 XP • Level 12</p>
                </div>
              </div>
              <div className="rank-target" style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Next Rank</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>#4 Meera</h4>
                    <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 'bold' }}>760 XP to go</p>
                  </div>
                  <div className="avatar" style={{ background: '#f472b6', color: 'white' }}>M</div>
                </div>
              </div>
            </div>

            <div className="top-players" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
               {leaderboardData.slice(0, 3).map(player => (
                 <div key={player.rank} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                   <div className="rank-mini" style={{ color: player.rank === 1 ? '#f59e0b' : player.rank === 2 ? '#94a3b8' : '#b45309', fontWeight: 'bold', fontSize: '1.2rem' }}>#{player.rank}</div>
                   <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'var(--color-primary)', color: 'white' }}>{player.avatar}</div>
                   <div>
                     <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '1rem' }}>{player.name}</h5>
                     <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{player.xp} XP</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Continue Playing */}
          <div className="section-container">
            <div className="section-header">
              <h2>Continue Playing</h2>
              <Link to="/games" className="view-all">View All</Link>
            </div>
            <div className="continue-grid">
              <div className="continue-card chess-banner">
                <div className="card-content">
                  <h3>Chess</h3>
                  <p>Resume Match</p>
                  <Link to="/games/chess" className="btn btn-primary">Resume</Link>
                </div>
              </div>
              <div className="continue-card sql-banner">
                <div className="card-content">
                  <h3>SQL Challenge</h3>
                  <p>Medium</p>
                  <Link to="/games/sql" className="btn btn-primary">Continue</Link>
                </div>
              </div>
              <div className="continue-card typing-banner">
                <div className="card-content">
                  <h3>Typing Test</h3>
                  <p>High Score: 68 WPM</p>
                  <Link to="/games" className="btn btn-primary">Try Again</Link>
                </div>
              </div>
              <div className="continue-card explore-banner">
                <div className="card-content centered">
                  <Gamepad2 size={40} className="mb-2" />
                  <h3>Explore More</h3>
                  <p>Browse Games</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsData.map((stat, idx) => (
              <div key={idx} className="stat-card glass-card">
                <div className="stat-header">
                  <div className="stat-icon-wrapper" style={{ color: getColor(stat.label) }}>
                    {getIcon(stat.label)}
                  </div>
                  <div className="stat-title">{stat.label}</div>
                </div>
                <div className="stat-body">
                  <div className="stat-value">
                    {stat.value}
                    {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
                  </div>
                  <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                    ▲ {stat.change}
                  </div>
                </div>
                <div className="stat-chart">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={stat.data.map(v => ({ value: v }))}>
                      <Line type="monotone" dataKey="value" stroke={getColor(stat.label)} strokeWidth={3} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: Daily Challenge & Achievements */}
          <div className="bottom-row-grid">
            <div className="daily-challenge-card glass-card">
              <div className="section-header">
                <h2>Daily Challenge</h2>
              </div>
              <div className="daily-content">
                <div className="trophy-illustration">🏆</div>
                <div className="daily-details">
                  <h3>Python Quiz</h3>
                  <div className="tags">
                    <span className="tag-difficulty">Medium</span>
                    <span className="tag-reward"><Star size={14}/> 75 XP</span>
                  </div>
                  <Link to="/games/python" className="btn btn-primary full-width">Play Challenge</Link>
                </div>
              </div>
            </div>

            <div className="achievements-preview glass-card">
              <div className="section-header">
                <h2>Achievements Preview</h2>
                <Link to="/achievements" className="view-all">View All</Link>
              </div>
              <div className="achievements-list">
                {achievementsData.map((ach) => (
                  <div key={ach.id} className="achievement-item">
                    <div className="achievement-icon" style={{ backgroundColor: ach.color }}>
                      {ach.icon}
                    </div>
                    <h4>{ach.name}</h4>
                    <p>{ach.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="dashboard-sidebar">
          
          <div className="todays-challenge glass-card">
            <div className="section-header">
              <h2><Trophy size={20} color="#f59e0b"/> Today's Challenge</h2>
            </div>
            <div className="challenge-logo">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" />
            </div>
            <h3>Python Quiz</h3>
            <div className="challenge-stats">
              <div className="stat">
                <span className="label">Difficulty</span>
                <span className="value tag-difficulty">Medium</span>
              </div>
              <div className="stat">
                <span className="label">Reward</span>
                <span className="value tag-reward"><Star size={16}/> 75 XP</span>
              </div>
            </div>
            <Link to="/games/python" className="btn btn-success full-width mt-4">Play Now</Link>
          </div>

          <div className="leaderboard-widget glass-card mt-6">
            <div className="section-header">
              <h2>Leaderboard Preview</h2>
              <Link to="/leaderboard" className="view-all">View Full</Link>
            </div>
            <div className="leaderboard-table">
              <div className="table-header">
                <span>Rank</span>
                <span>Player</span>
                <span>XP</span>
                <span>Level</span>
              </div>
              {leaderboardData.map((player) => (
                <div key={player.rank} className={`table-row ${player.isCurrent ? 'current-user' : ''}`}>
                  <div className={`rank-circle rank-${player.rank}`}>{player.rank}</div>
                  <div className="player-col">
                    <div className="avatar">{player.avatar}</div>
                    <span className="name">{player.name} {player.isCurrent && '(You)'}</span>
                  </div>
                  <div className="xp-col">{player.xp}</div>
                  <div className="level-col"><div className="lvl-badge">{player.level}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-feed glass-card mt-6">
            <div className="section-header">
              <h2>Activity Feed</h2>
              <Link to="/history" className="view-all">View All</Link>
            </div>
            <div className="feed-list">
              {activityFeed.map((item) => (
                <div key={item.id} className="feed-item">
                  <div className={`feed-icon type-${item.type}`}>{item.icon}</div>
                  <div className="feed-content">
                    <p>
                      <span className="action">{item.action}</span> <strong>{item.game}</strong> {item.suffix}
                    </p>
                    <span className="time">{item.time}</span>
                  </div>
                  <div className="feed-reward">{item.reward}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
