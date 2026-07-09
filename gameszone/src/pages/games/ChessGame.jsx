import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion } from 'framer-motion';
import { Send, Users, UserPlus, Flag, RefreshCw, Lightbulb, BrainCircuit } from 'lucide-react';
import GameRulesModal from '../../components/games/GameRulesModal';
import { getBestMove } from '../../utils/chessAI';
import './GamesLayout.css';

const CHESS_RULES = [
  "White always moves first.",
  "You cannot move a piece to a square occupied by your own piece.",
  "A king is in 'check' when it is under attack by an opponent's piece.",
  "You cannot make a move that puts or leaves your own king in check.",
  "The game is won when the opponent's king is in checkmate.",
  "Earn +50 XP for winning a match."
];

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [showRules, setShowRules] = useState(false); // Initially false, triggered after setup
  const [status, setStatus] = useState('Match started. Good luck!');
  const [difficulty, setDifficulty] = useState(2); // 1 = Easy, 2 = Medium, 3 = Hard
  const [isThinking, setIsThinking] = useState(false);
  
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'human'
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  function updateGameStatus(chessInstance) {
    if (chessInstance.isGameOver()) {
      if (chessInstance.isCheckmate()) setStatus('Checkmate! Game Over.');
      else if (chessInstance.isDraw()) setStatus('Draw!');
      else setStatus('Game Over');
    } else if (chessInstance.isCheck()) {
      setStatus('Check!');
    } else {
      setStatus('Match ongoing...');
    }
  }

  function makeMove(move) {
    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn()); // preserve history

      let result;
      try {
        result = gameCopy.move(move);
      } catch (e) {
        // Fallback for strict chess.js validation
        result = gameCopy.move({ ...move, promotion: 'q' });
      }
      
      if (result) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        updateGameStatus(gameCopy);
        return gameCopy.pgn(); // Pass PGN to bot so history is preserved
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    if (game.isGameOver()) return false; 
    if (gameMode === 'ai' && game.turn() === 'b') return false; 
    
    const isPromotion = (piece === 'wP' && targetSquare[1] === '8') || 
                        (piece === 'bP' && targetSquare[1] === '1');

    const move = {
      from: sourceSquare,
      to: targetSquare,
    };
    if (isPromotion) move.promotion = 'q';

    const newPgn = makeMove(move);

    if (!newPgn) return false;
    
    if (gameMode === 'ai') {
      setIsThinking(true);
      setTimeout(() => {
        makeBotMove(newPgn);
      }, 300);
    } else {
      // Human mode: Just update status for the next player
      setStatus(game.turn() === 'w' ? "White's Turn" : "Black's Turn");
    }
    return true;
  }
  
  function makeBotMove(currentPgn) {
    try {
      const tempGame = new Chess();
      tempGame.loadPgn(currentPgn);
      
      if (tempGame.isGameOver()) {
        setIsThinking(false);
        return;
      }

      const bestMove = getBestMove(tempGame, difficulty);
      if (bestMove) {
        const gameCopy = new Chess();
        gameCopy.loadPgn(tempGame.pgn());
        gameCopy.move(bestMove);
        setGame(gameCopy);
        setFen(gameCopy.fen());
        updateGameStatus(gameCopy);
      }
    } catch (err) {
      console.error("Bot encountered an error:", err);
    }
    setIsThinking(false);
  }

  function getHint() {
    if (game.isGameOver() || game.turn() === 'b' || isThinking) return;
    setIsThinking(true);
    setStatus('Evaluating best move...');
    setTimeout(() => {
      const bestMove = getBestMove(game, 2); // Depth 2 for hints
      if (bestMove) {
        setStatus(`Hint: Try playing ${bestMove}`);
      }
      setIsThinking(false);
    }, 500);
  }

  return (
    <motion.div 
      className="game-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showRules && (
        <GameRulesModal 
          gameTitle="Chess" 
          rules={
            gameMode === 'ai' 
              ? [
                  ...CHESS_RULES.slice(0, 5),
                  "Playing with the computer is for practice and does NOT increase your XP points."
                ]
              : [
                  ...CHESS_RULES.slice(0, 5),
                  "Earn +50 XP for winning a Ranked Match against a human opponent."
                ]
          } 
          onAccept={() => setShowRules(false)} 
        />
      )}

      <div className="game-main" style={{ position: 'relative' }}>
        {!isSetupComplete && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)' }}>
            <div className="glass-card text-center" style={{ padding: '2.5rem', maxWidth: '400px', width: '100%' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Choose Game Mode</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className={`btn ${gameMode === 'ai' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setGameMode('ai')}
                  style={{ padding: '1rem' }}
                >
                  <BrainCircuit size={20} /> Play vs Computer
                </button>
                <button 
                  className={`btn ${gameMode === 'human' ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setGameMode('human')}
                  style={{ padding: '1rem' }}
                >
                  <Users size={20} /> Play vs Friend (Pass & Play)
                </button>
              </div>

              {gameMode === 'ai' && (
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <span>Difficulty:</span>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    <option value={1}>Easy</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Hard</option>
                  </select>
                </div>
              )}

              <button 
                className="btn btn-success full-width" 
                style={{ marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}
                onClick={() => {
                  setIsSetupComplete(true);
                  setShowRules(true); // Trigger rules after setup
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="game-header glass-card">
          <div className="game-title">
            <div className="game-icon">♟</div>
            <div>
              <h2>Chess Arena</h2>
              <span className="badge">{gameMode === 'ai' ? 'Vs Computer' : 'Pass & Play'}</span>
            </div>
          </div>
          <div className="game-actions">
            {gameMode === 'ai' && (
              <div className="difficulty-selector" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                <BrainCircuit size={16} />
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.5rem' }}
                  disabled={isThinking || game.history().length > 0}
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary btn-sm" onClick={getHint} disabled={isThinking || gameMode === 'human'}><Lightbulb size={16} /> Hint</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setGame(new Chess()); setFen('start'); setStatus('New game started.'); setIsThinking(false); setIsSetupComplete(false); }}><RefreshCw size={16} /> New Game</button>
            <button className="btn btn-danger btn-sm"><Flag size={16} /> Report</button>
          </div>
        </div>

        <div className="game-board-area glass-card">
          <div className="player-info top-player">
            <div className="avatar">
              <img src={`https://ui-avatars.com/api/?name=${gameMode === 'ai' ? 'AI' : 'Player+2'}&background=ef4444&color=fff`} alt="Opponent" />
            </div>
            <div className="details">
              <h4>{gameMode === 'ai' ? (isThinking ? "AI is thinking..." : "AI Bot") : "Player 2"}</h4>
              <span className="rating">{gameMode === 'ai' ? `Level ${difficulty}` : "Pass & Play"}</span>
            </div>
            <div className="timer">10:00</div>
          </div>
          
          <div className="chess-board-wrapper" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '1rem 0' }}>
            <Chessboard 
              position={fen} 
              onPieceDrop={onDrop}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
              customDarkSquareStyle={{ backgroundColor: '#779556' }}
              customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
            />
          </div>

          <div className="player-info bottom-player">
            <div className="avatar">
              <img src="https://ui-avatars.com/api/?name=Sriram&background=4F46E5&color=fff" alt="You" />
            </div>
            <div className="details">
              <h4>Sriram (You)</h4>
              <span className="rating">1250 ELO</span>
            </div>
            <div className="timer active">09:45</div>
          </div>
        </div>
      </div>

      <div className="game-sidebar">
        <div className="game-status glass-card">
          <div className="status-indicator">
            <div className="dot pulse"></div>
            <span>{status}</span>
          </div>
          <div className="move-history">
            {/* simple move history representation */}
            {game.history().map((move, idx) => {
              if (idx % 2 === 0) {
                return (
                  <div key={idx} className="move-row">
                    <span className="move-num">{Math.floor(idx/2) + 1}.</span>
                    <span className="move-white">{move}</span>
                    <span className="move-black">{game.history()[idx+1] || ''}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="game-chat glass-card">
          <div className="chat-tabs">
            <button className="tab active"><Users size={16} /> Match Chat</button>
            <button className="tab"><UserPlus size={16} /> Friends</button>
          </div>
          <div className="chat-messages">
            <div className="system-msg">
              <span>Match started. Good luck!</span>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Send message..." />
            <button className="send-btn"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
