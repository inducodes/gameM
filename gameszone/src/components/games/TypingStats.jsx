import React from 'react';
import './TypingStats.css';

const ALL_KEYS = ['E','N','I','A','R','L','T','O','S','U','P','Y','C','G','H','M','K','B','W','F','Z','V','X','Q','J'];

export default function TypingStats({ wpm, accuracy, score, nextKey, unlockedIndex, lessonStats, keyStats }) {
  const currentKey = nextKey ? nextKey.toUpperCase() : '-';

  const averageAccuracy = lessonStats.lessonCount > 0 
    ? (lessonStats.totalAccuracy / lessonStats.lessonCount) 
    : 0;

  return (
    <div className="typing-stats-container">
      <div className="stat-row">
        <span className="stat-label">Metrics:</span>
        <span className="stat-item">Speed: <strong>{wpm.toFixed(1)}wpm</strong></span>
        <span className="stat-item">Accuracy: <strong>{accuracy.toFixed(2)}%</strong></span>
        <span className="stat-item">Score: <strong>{score.toLocaleString()}</strong></span>
      </div>

      <div className="stat-row">
        <span className="stat-label">All keys:</span>
        <div className="all-keys-list">
          {ALL_KEYS.map((k, i) => {
            let statusClass = 'new';
            if (i < unlockedIndex - 1) {
              statusClass = 'mastered';
            } else if (i === unlockedIndex - 1) {
              statusClass = 'learning';
            }
            
            // Override with mistake colors if needed
            const lowerK = k.toLowerCase();
            const stats = keyStats && keyStats[lowerK];
            if (stats && stats.misses > 0) {
              if (stats.misses >= 8) {
                statusClass = 'critical-key';
              } else if (stats.misses >= 3) {
                statusClass = 'warning-key';
              }
            }

            return (
              <span key={i} className={`key-stat-box ${statusClass}`}>
                {k}
              </span>
            );
          })}
        </div>
      </div>

      <div className="stat-row">
        <span className="stat-label">Current key:</span>
        <span className="current-key-box">{currentKey}</span>
        <span className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Last speed: <strong>{lessonStats.lastSpeed.toFixed(1)}wpm</strong>
          {lessonStats.lessonCount > 1 && (
            <span style={{ 
              color: lessonStats.lastSpeed > lessonStats.previousSpeed ? '#4caf50' : 
                     lessonStats.lastSpeed < lessonStats.previousSpeed ? '#f44336' : '#757575',
              fontWeight: 'bold',
              fontSize: '1.2em',
              lineHeight: 1
            }}>
              {lessonStats.lastSpeed > lessonStats.previousSpeed ? '↑' : 
               lessonStats.lastSpeed < lessonStats.previousSpeed ? '↓' : '-'}
            </span>
          )}
        </span>
        <span className="stat-item">Top speed: <strong>{lessonStats.topSpeed.toFixed(1)}wpm</strong></span>
        <span className="stat-item">Learning rate: <strong>{lessonStats.learningRate}</strong></span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Accuracy:</span>
        <span className="stat-item">
          {lessonStats.lessonCount > 0 ? (
            <span><strong>{lessonStats.lessonCount}</strong> lessons completed with <strong>{averageAccuracy.toFixed(1)}%</strong> average accuracy.</span>
          ) : (
            <span>Complete your first lesson to see history!</span>
          )}
        </span>
      </div>

      <div className="stat-row">
        <span className="stat-label">Daily goal:</span>
        <span className="stat-item"><strong>{Math.min(100, Math.round((lessonStats.lessonCount / 5) * 100))}%</strong>/5 lessons</span>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${Math.min(100, (lessonStats.lessonCount / 5) * 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
}
