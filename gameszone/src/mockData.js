export const statsData = [
  { label: 'Games Played', value: '48', change: '+ 12%', isPositive: true, data: [10, 15, 12, 18, 25, 30, 48] },
  { label: 'Games Won', value: '32', change: '+ 8%', isPositive: true, data: [5, 8, 7, 12, 18, 22, 32] },
  { label: 'XP', value: '890', change: '+ 15%', isPositive: true, data: [100, 200, 350, 400, 600, 750, 890] },
  { label: 'Coins', value: '1250', change: '+ 10%', isPositive: true, data: [200, 400, 600, 800, 950, 1100, 1250] },
  { label: 'Daily Streak', value: '7', suffix: ' Days', change: '+ 5%', isPositive: true, data: [1, 2, 3, 4, 5, 6, 7] },
  { label: 'Level', value: '12', change: '+ 7%', isPositive: true, data: [5, 6, 8, 9, 10, 11, 12] }
];

export const leaderboardData = [
  { rank: 1, name: 'Arjun', xp: '2450', level: 18, avatar: 'A' },
  { rank: 2, name: 'Priya', xp: '2100', level: 16, avatar: 'P' },
  { rank: 3, name: 'Karthik', xp: '1890', level: 14, avatar: 'K' },
  { rank: 4, name: 'Meera', xp: '1650', level: 13, avatar: 'M' },
  { rank: 5, name: 'Sriram', xp: '890', level: 12, avatar: 'S', isCurrent: true },
];

export const activityFeed = [
  { id: 1, action: 'You won a match in', game: 'Chess', reward: '+50 XP', time: '1h ago', icon: '♟', type: 'win' },
  { id: 2, action: 'Priya completed', game: 'SQL Challenge', reward: '+75 XP', time: '2h ago', icon: '{}', type: 'complete' },
  { id: 3, action: 'Karthik earned', game: 'Python Master', suffix: 'badge', reward: '+100 XP', time: '3h ago', icon: '🏅', type: 'badge' },
  { id: 4, action: 'Arjun reached', game: 'Level 18', reward: '+150 XP', time: '5h ago', icon: '⭐', type: 'level' },
];

export const achievementsData = [
  { id: 1, name: 'First Win', desc: 'Win your first game', color: '#22c55e', icon: '🏆' },
  { id: 2, name: 'Python Master', desc: 'Score 100 in Python Quiz', color: '#3b82f6', icon: '🐍' },
  { id: 3, name: 'Chess Master', desc: 'Win 10 chess matches', color: '#8b5cf6', icon: '♟' },
  { id: 4, name: '7 Day Streak', desc: 'Play for 7 days', color: '#ef4444', icon: '🔥' },
];
