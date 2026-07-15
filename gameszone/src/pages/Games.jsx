import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Games.css';

const gamesList = [
  {
    id: 'chess',
    title: 'Chess',
    description: 'Improve strategy and critical thinking.',
    icon: '♟',
    mode: 'Single & Multiplayer',
    difficulty: 'Hard',
    reward: '100 XP',
    path: '/games/chess'
  },
  {
    id: 'sql',
    title: 'SQL Challenge',
    description: 'Test your database querying skills.',
    icon: '{ }',
    mode: 'Single Player',
    difficulty: 'Medium',
    reward: '75 XP',
    path: '/games/sql'
  },
  {
    id: 'python',
    title: 'Python Quiz',
    description: 'Brush up on your Python syntax.',
    icon: '🐍',
    mode: 'Single Player',
    difficulty: 'Easy',
    reward: '50 XP',
    path: '/games/python'
  },
  {
    id: 'typing',
    title: 'Typing Test',
    description: 'Boost your WPM and accuracy.',
    icon: '⌨️',
    mode: 'Single Player',
    difficulty: 'Medium',
    reward: '60 XP',
    path: '/games/typing'
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Classic game of Xs and Os.',
    icon: '❌',
    mode: 'Multiplayer',
    difficulty: 'Easy',
    reward: '30 XP',
    path: '/games/tictactoe'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Number placement puzzle.',
    icon: '🔢',
    mode: 'Single Player',
    difficulty: 'Hard',
    reward: '120 XP',
    path: '/games/sudoku'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Games() {
  return (
    <div className="games-page">
      <div className="page-header">
        <h1>Games Arena</h1>
        <p>Choose a game to play and earn XP.</p>
      </div>

      <motion.div 
        className="games-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {gamesList.map((game) => (
          <motion.div key={game.id} className="game-card glass-card" variants={itemVariants}>
            <div className="game-card-icon">{game.icon}</div>
            <div className="game-card-content">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              
              <div className="game-tags">
                <span className="tag mode-tag">{game.mode}</span>
                <span className={`tag difficulty-tag ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
              </div>
              
              <div className="game-reward">
                Reward: <strong>{game.reward}</strong>
              </div>
              
              <div className="game-actions">
                <Link to={game.path} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none' }}>
                  <Play size={16} /> Play
                </Link>
                <button className="btn btn-secondary"><Info size={16} /> Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
