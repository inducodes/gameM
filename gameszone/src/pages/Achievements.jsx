import { achievementsData } from '../mockData';
import { Medal, Lock, CheckCircle2 } from 'lucide-react';
import './Achievements.css';

export default function Achievements() {
  // Let's create some more mock data specifically for the achievements page
  const allAchievements = [
    ...achievementsData.map(a => ({ ...a, progress: 100, unlocked: true })),
    { id: 5, name: 'SQL Guru', desc: 'Score 100 in SQL Challenge', color: '#f59e0b', icon: '💾', progress: 40, unlocked: false },
    { id: 6, name: 'Social Butterfly', desc: 'Add 5 friends', color: '#ec4899', icon: '🦋', progress: 80, unlocked: false },
    { id: 7, name: 'Grandmaster', desc: 'Win 50 chess matches', color: '#14b8a6', icon: '👑', progress: 20, unlocked: false },
    { id: 8, name: 'Night Owl', desc: 'Play 3 games after midnight', color: '#6366f1', icon: '🦉', progress: 66, unlocked: false },
    { id: 9, name: 'Speed Typer', desc: 'Reach 80 WPM in Typing Test', color: '#06b6d4', icon: '⌨️', progress: 95, unlocked: false },
  ];

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="achievements-page">
      <div className="page-header">
        <div>
          <h1>Achievements</h1>
          <p>Track your milestones and showcase your skills.</p>
        </div>
      </div>

      <div className="achievements-summary">
        <div className="summary-icon">
          <Medal size={40} color="var(--color-primary)" />
        </div>
        <div className="summary-content">
          <h3>Completion Rate</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="progress-text">{progressPercent}%</span>
          </div>
          <p>{unlockedCount} of {totalCount} unlocked</p>
        </div>
      </div>

      <div className="achievements-grid">
        {allAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div 
              className="achievement-icon-large" 
              style={{ backgroundColor: achievement.unlocked ? `${achievement.color}15` : 'rgba(0,0,0,0.05)' }}
            >
              <span style={{ filter: achievement.unlocked ? 'none' : 'grayscale(100%) opacity(0.5)' }}>
                {achievement.icon}
              </span>
              {achievement.unlocked && (
                <div className="check-badge">
                  <CheckCircle2 size={16} color="white" fill="#22c55e" />
                </div>
              )}
              {!achievement.unlocked && (
                <div className="lock-badge">
                  <Lock size={14} color="white" />
                </div>
              )}
            </div>
            
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.desc}</p>
              
              {!achievement.unlocked && (
                <div className="achievement-progress">
                  <div className="ap-bar">
                    <div 
                      className="ap-fill" 
                      style={{ width: `${achievement.progress}%`, backgroundColor: achievement.color }}
                    ></div>
                  </div>
                  <span className="ap-text">{achievement.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
