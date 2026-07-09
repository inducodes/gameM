import { useState, useEffect, useRef } from 'react';
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

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState(() => {
    try {
      const raw = localStorage.getItem('ttt-scores');
      return raw ? JSON.parse(raw) : { X: 0, O: 0, draws: 0 };
    } catch {
      return { X: 0, O: 0, draws: 0 };
    }
  });
  const [playerX, setPlayerX] = useState(() => localStorage.getItem('ttt-playerX') || 'Player X');
  const [playerO, setPlayerO] = useState(() => localStorage.getItem('ttt-playerO') || 'Player O');
  const roundFinished = useRef(false);

  const winner = calculateWinner(board);

  function handleClick(i) {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  useEffect(() => {
    // handle win
    if (winner && !roundFinished.current) {
      setScores((prev) => {
        const updated = { ...prev, [winner]: (prev[winner] || 0) + 1 };
        try { localStorage.setItem('ttt-scores', JSON.stringify(updated)); } catch {}
        return updated;
      });
      roundFinished.current = true;
    }

    // handle draw
    if (!winner && board.every((c) => c !== null) && !roundFinished.current) {
      setScores((prev) => {
        const updated = { ...prev, draws: (prev.draws || 0) + 1 };
        try { localStorage.setItem('ttt-scores', JSON.stringify(updated)); } catch {}
        return updated;
      });
      roundFinished.current = true;
    }
  }, [winner, board]);

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    roundFinished.current = false;
  }

  function resetScores() {
    const cleared = { X: 0, O: 0, draws: 0 };
    setScores(cleared);
    try { localStorage.setItem('ttt-scores', JSON.stringify(cleared)); } catch {}
  }

  function saveNames() {
    try {
      localStorage.setItem('ttt-playerX', playerX);
      localStorage.setItem('ttt-playerO', playerO);
    } catch {}
  }

  return (
    <div className="game-page">
      <h2>Tic Tac Toe</h2>
      <div className="ttt-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '8px' }}>
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className="ttt-cell btn" style={{ height: 80, fontSize: 24 }}>
            {cell}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem' }}>Name (X)</label>
            <input value={playerX} onChange={(e) => setPlayerX(e.target.value)} style={{ padding: '4px 8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem' }}>Name (O)</label>
            <input value={playerO} onChange={(e) => setPlayerO(e.target.value)} style={{ padding: '4px 8px' }} />
          </div>
          <div>
            <button className="btn btn-secondary" onClick={saveNames}>Save Names</button>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {winner ? <div><strong>Winner:</strong> {winner === 'X' ? playerX : playerO} ({winner})</div> : <div>Next: {xIsNext ? playerX + ' (X)' : playerO + ' (O)'}</div>}
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={reset}>Reset Board</button>
            <button className="btn" onClick={resetScores}>Reset Scores</button>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>Scoreboard</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <div>{playerX} (X): {scores.X}</div>
            <div>{playerO} (O): {scores.O}</div>
            <div>Draws: {scores.draws}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
