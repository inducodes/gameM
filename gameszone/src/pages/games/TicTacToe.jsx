import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Menu, Circle as CircleIcon, X as XIcon } from 'lucide-react';
import './GamesLayout.css';

function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let move = -1;
  // To add a tiny bit of variance on the first move if AI starts, we could randomize,
  // but standard minimax is fine here as X always starts in our logic.
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const Cross = () => (
  <svg viewBox="0 0 100 100" style={{ width: '65%', height: '65%' }}>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3 }}
      d="M 20 20 L 80 80 M 80 20 L 20 80"
      stroke="#f43f5e"
      strokeWidth="16"
      strokeLinecap="round"
      fill="transparent"
    />
  </svg>
);

const Circle = () => (
  <svg viewBox="0 0 100 100" style={{ width: '65%', height: '65%' }}>
    <motion.circle
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3 }}
      cx="50"
      cy="50"
      r="32"
      stroke="#0ea5e9"
      strokeWidth="16"
      strokeLinecap="round"
      fill="transparent"
    />
  </svg>
);

export default function TicTacToe() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'finished'
  const [mode, setMode] = useState('vsAI'); // 'vsFriend', 'vsAI'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); 
  const [scores, setScores] = useState({ p1: 0, ties: 0, p2: 0 }); 
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (gameState === 'playing' && mode === 'vsAI' && !xIsNext && !winner) {
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board);
        if (aiMove !== -1) {
          handleClick(aiMove, true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, gameState, mode, winner, board]);

  const handleClick = (i, isAiMove = false) => {
    if (gameState !== 'playing' || board[i] || winner) return;
    if (mode === 'vsAI' && !xIsNext && !isAiMove) return; 

    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setGameState('finished');
      setScores(prev => ({ ...prev, [newWinner === 'X' ? 'p1' : 'p2']: prev[newWinner === 'X' ? 'p1' : 'p2'] + 1 }));
    } else if (isBoardFull(newBoard)) {
      setWinner('Draw');
      setGameState('finished');
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameState('playing');
  };

  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setScores({ p1: 0, ties: 0, p2: 0 });
    resetGame();
  };

  const getBorders = (index) => {
    let style = {};
    const thickBorder = '8px solid #d1d5db';
    if (index % 3 !== 2) style.borderRight = thickBorder; 
    if (index < 6) style.borderBottom = thickBorder; 
    return style;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {gameState !== 'menu' && (
        <>
          {/* Top Nav Buttons */}
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGameState('menu')} 
              style={{ background: '#06b6d4', border: '3px solid #0891b2', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            >
              <Menu size={28} />
            </motion.button>
          </div>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ background: '#06b6d4', border: '3px solid #0891b2', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            >
              <Settings size={28} />
            </motion.button>
          </div>

          {/* Win Banner Overlay */}
          <AnimatePresence>
            {gameState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetGame}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 50,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.92)',
                  padding: '3rem 0',
                  textAlign: 'center',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                    {winner === 'Draw' ? "It's a Draw!" : `${winner === 'X' ? 'Player 1' : (mode === 'vsAI' ? 'Computer' : 'Player 2')} Wins!`}
                  </h2>
                  <p style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0, color: '#cbd5e1' }}>Press anywhere to play again.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '400px', height: '400px', marginBottom: '3rem' }}>
            {board.map((cell, i) => (
              <div 
                key={i} 
                onClick={() => handleClick(i)}
                style={{
                  ...getBorders(i),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (gameState === 'playing' && !cell) ? 'pointer' : 'default',
                  backgroundColor: 'transparent'
                }}
              >
                {cell === 'X' && <Cross />}
                {cell === 'O' && <Circle />}
              </div>
            ))}
          </div>

          {/* Scoreboard */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>{scores.p1}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '1px' }}>
                <XIcon size={16} color="#f43f5e" strokeWidth={4} /> PLAYER 1
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>{scores.ties}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', letterSpacing: '1px', marginTop: '3px' }}>TIES</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>{scores.p2}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '1px' }}>
                <CircleIcon size={14} color="#0ea5e9" strokeWidth={4} /> {mode === 'vsAI' ? 'COMPUTER' : 'PLAYER 2'}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '400px' }}
        >
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px' }}><Cross /></div>
            <div style={{ width: '80px', height: '80px' }}><Circle /></div>
          </div>
          <h1 style={{ fontSize: '3rem', color: '#0f172a', fontWeight: 'bold', marginBottom: '3rem', letterSpacing: '2px' }}>TIC TAC TOE</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame('vsAI')} 
              style={{ padding: '1.25rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.4)' }}
            >
              1 PLAYER (VS COMPUTER)
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame('vsFriend')} 
              style={{ padding: '1.25rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '12px', background: '#f8fafc', color: '#0ea5e9', border: '3px solid #0ea5e9', cursor: 'pointer' }}
            >
              2 PLAYERS (VS FRIEND)
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
