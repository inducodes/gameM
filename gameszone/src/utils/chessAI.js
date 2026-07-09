// Standard piece values for evaluation
const PIECE_VALUES = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

// Evaluate the board based on piece material
function evaluateBoard(game) {
  let totalEvaluation = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j]);
    }
  }

  return totalEvaluation;
}

function getPieceValue(piece) {
  if (piece === null) return 0;
  
  const val = PIECE_VALUES[piece.type] || 0;
  // White is maximizing, Black is minimizing
  return piece.color === 'w' ? val : -val;
}

// Minimax with Alpha-Beta pruning
export function getBestMove(game, depth) {
  if (depth === 0) {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null;
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return null;

  let bestMove = null;
  let bestValue = game.turn() === 'w' ? -Infinity : Infinity;
  
  // Alpha-beta limits
  let alpha = -Infinity;
  let beta = Infinity;
  const isMaximizingPlayer = game.turn() === 'w';

  // Basic randomization to avoid identical repetitive games
  possibleMoves.sort(() => Math.random() - 0.5);

  for (let i = 0; i < possibleMoves.length; i++) {
    const move = possibleMoves[i];
    game.move(move);
    
    // Evaluate the move
    const boardValue = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer);
    
    game.undo(); // Undo the move

    if (isMaximizingPlayer) {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      beta = Math.min(beta, bestValue);
    }
    
    if (beta <= alpha) break; // Prune
  }

  return bestMove || possibleMoves[0];
}

function minimax(game, depth, alpha, beta, isMaximizingPlayer) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const possibleMoves = game.moves();

  if (isMaximizingPlayer) {
    let bestVal = -Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestVal = Math.max(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestVal);
      if (beta <= alpha) break;
    }
    return bestVal;
  } else {
    let bestVal = Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestVal = Math.min(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
      game.undo();
      beta = Math.min(beta, bestVal);
      if (beta <= alpha) break;
    }
    return bestVal;
  }
}
