import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, RefreshCw, ArrowLeft, Star, Zap, Shield, Users, User, Globe, Edit2 } from 'lucide-react';
import GameRulesModal from '../../components/games/GameRulesModal';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import './GamesLayout.css';

const SUDOKU_RULES = [
  "Each row must contain the numbers 1-9 exactly once.",
  "Each column must contain the numbers 1-9 exactly once.",
  "Each 3x3 grid must contain the numbers 1-9 exactly once.",
  "Fill in all the empty cells to win.",
  "Complete the puzzle quickly to get the best time!"
];

const PUZZLES = {
  easy: [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    [
      [0, 4, 0, 0, 0, 0, 1, 7, 9], [0, 0, 2, 0, 0, 8, 0, 5, 4], [0, 0, 6, 0, 0, 5, 0, 0, 8],
      [0, 8, 0, 0, 7, 0, 9, 1, 0], [0, 5, 0, 0, 9, 0, 0, 3, 0], [0, 1, 9, 0, 6, 0, 0, 4, 0],
      [3, 0, 0, 4, 0, 0, 7, 0, 0], [5, 7, 0, 1, 0, 0, 2, 0, 0], [9, 2, 8, 0, 0, 0, 0, 6, 0]
    ],
    [
      [1, 0, 0, 4, 8, 9, 0, 0, 6], [7, 3, 0, 0, 0, 0, 0, 4, 0], [0, 0, 0, 0, 0, 1, 2, 9, 5],
      [0, 0, 7, 1, 2, 0, 6, 0, 0], [5, 0, 0, 7, 0, 3, 0, 0, 8], [0, 0, 6, 0, 9, 5, 7, 0, 0],
      [9, 1, 4, 6, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0, 3, 7], [8, 0, 0, 5, 1, 2, 0, 0, 4]
    ],
    [
      [0, 2, 0, 0, 0, 0, 0, 1, 0], [0, 0, 6, 0, 4, 0, 8, 0, 0], [5, 8, 0, 2, 0, 9, 0, 7, 4],
      [0, 0, 5, 4, 0, 3, 9, 0, 0], [0, 7, 0, 0, 0, 0, 0, 4, 0], [0, 0, 4, 7, 0, 1, 3, 0, 0],
      [8, 3, 0, 9, 0, 4, 0, 6, 7], [0, 0, 2, 0, 7, 0, 1, 0, 0], [0, 4, 0, 0, 0, 0, 0, 5, 0]
    ],
    [
      [3, 0, 0, 8, 0, 1, 0, 0, 2], [2, 0, 1, 0, 3, 0, 6, 0, 4], [0, 0, 0, 2, 0, 4, 0, 0, 0],
      [8, 0, 9, 0, 0, 0, 1, 0, 6], [0, 6, 0, 0, 0, 0, 0, 5, 0], [7, 0, 2, 0, 0, 0, 4, 0, 9],
      [0, 0, 0, 5, 0, 9, 0, 0, 0], [9, 0, 4, 0, 8, 0, 7, 0, 5], [6, 0, 0, 1, 0, 7, 0, 0, 3]
    ]
  ],
  medium: [
    [
      [0, 2, 0, 6, 0, 8, 0, 0, 0], [5, 8, 0, 0, 0, 9, 7, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0], [6, 0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 9, 8, 0, 0, 0, 3, 6], [0, 0, 0, 3, 0, 6, 0, 9, 0]
    ],
    [
      [0, 0, 0, 0, 0, 0, 2, 0, 0], [0, 8, 0, 0, 0, 7, 0, 9, 0], [6, 0, 2, 0, 0, 0, 5, 0, 0],
      [0, 7, 0, 0, 6, 0, 0, 0, 0], [0, 0, 0, 9, 0, 1, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 4, 0],
      [0, 0, 5, 0, 0, 0, 6, 0, 3], [0, 9, 0, 4, 0, 0, 0, 7, 0], [0, 0, 6, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 4, 0, 9, 0], [8, 0, 2, 9, 7, 0, 0, 0, 0], [9, 0, 1, 2, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 4, 9, 1, 5, 7], [0, 1, 3, 0, 5, 0, 9, 2, 0], [5, 7, 9, 1, 2, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 2, 6, 0, 3], [0, 0, 0, 0, 3, 8, 2, 0, 5], [0, 2, 0, 5, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 5, 0, 1, 0, 0, 0, 0], [0, 0, 2, 0, 0, 4, 3, 0, 0], [1, 0, 9, 0, 0, 0, 2, 0, 6],
      [2, 0, 0, 0, 3, 0, 0, 0, 0], [0, 4, 0, 0, 0, 0, 0, 7, 0], [0, 0, 0, 0, 7, 0, 0, 0, 5],
      [9, 0, 6, 0, 0, 0, 7, 0, 1], [0, 0, 8, 1, 0, 0, 4, 0, 0], [0, 0, 0, 0, 5, 0, 8, 0, 0]
    ],
    [
      [9, 0, 0, 0, 8, 0, 3, 0, 0], [0, 0, 0, 2, 5, 0, 7, 0, 0], [0, 2, 5, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 5, 0, 0, 0], [0, 4, 0, 9, 0, 2, 0, 6, 0], [0, 0, 0, 7, 0, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 1, 9, 0], [0, 0, 8, 0, 4, 1, 0, 0, 0], [0, 0, 3, 0, 9, 0, 0, 0, 2]
    ]
  ],
  hard: [
    [
      [0, 0, 0, 6, 0, 0, 4, 0, 0], [7, 0, 0, 0, 0, 3, 6, 0, 0], [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 5, 0, 1, 8, 0, 0, 0, 3], [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0], [9, 0, 3, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 8, 5], [0, 0, 1, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 7, 0, 0, 0], [0, 0, 4, 0, 0, 0, 1, 0, 0], [0, 9, 0, 0, 0, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 2, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 9]
    ],
    [
      [0, 0, 0, 7, 0, 0, 8, 0, 0], [0, 0, 6, 0, 0, 0, 0, 3, 1], [0, 4, 0, 0, 0, 2, 0, 0, 0],
      [0, 2, 4, 0, 7, 0, 0, 0, 0], [0, 1, 0, 0, 3, 0, 0, 8, 0], [0, 0, 0, 0, 6, 0, 2, 9, 0],
      [0, 0, 0, 8, 0, 0, 0, 7, 0], [8, 6, 0, 0, 0, 0, 5, 0, 0], [0, 0, 2, 0, 0, 6, 0, 0, 0]
    ],
    [
      [0, 2, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 6, 0, 0, 0, 0, 3], [0, 7, 4, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 2], [0, 8, 0, 0, 4, 0, 0, 1, 0], [6, 0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 7, 8, 0], [5, 0, 0, 0, 0, 9, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 4, 0]
    ],
    [
      [4, 0, 0, 0, 0, 0, 8, 0, 5], [0, 3, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 6, 0], [0, 0, 0, 0, 8, 0, 4, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 3, 0, 7, 0], [5, 0, 0, 2, 0, 0, 0, 0, 0], [1, 0, 4, 0, 0, 0, 0, 0, 0]
    ]
  ]
};

const copyBoard = (board) => board.map(row => [...row]);

const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const solveSudoku = (initialGrid) => {
  const grid = initialGrid.map(row => [...row]);
  
  const isValid = (r, c, k) => {
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] === k) return false;
      if (grid[i][c] === k) return false;
      if (grid[3 * Math.floor(r / 3) + Math.floor(i / 3)][3 * Math.floor(c / 3) + i % 3] === k) return false;
    }
    return true;
  };

  const solve = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(r, c, num)) {
              grid[r][c] = num;
              if (solve()) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve();
  return grid;
};

export default function SudokuGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('SELECT_MODE'); // SELECT_MODE, SELECT_LEVEL, MULTIPLAYER_MENU, ROOM_LOBBY, PLAYING
  const [showRules, setShowRules] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState(null);
  const [initialBoard, setInitialBoard] = useState(null);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errorCells, setErrorCells] = useState(new Set());
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState({});
  
  // Multiplayer state
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const [opponentTime, setOpponentTime] = useState(null);
  const [roomWinner, setRoomWinner] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [puzzleIndices, setPuzzleIndices] = useState(() => {
    try {
      const saved = localStorage.getItem('sudoku-puzzle-indices');
      return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
    } catch {
      return { easy: 0, medium: 0, hard: 0 };
    }
  });

  const [bestTimes, setBestTimes] = useState(() => {
    try {
      const saved = localStorage.getItem('sudoku-best-times');
      return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
    } catch {
      return { easy: null, medium: null, hard: null };
    }
  });

  useEffect(() => {
    let interval = null;
    if (timerActive && !isComplete && gameState === 'PLAYING') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isComplete, gameState]);

  useEffect(() => {
    if (!roomId) return;
    
    const unsub = onSnapshot(doc(db, 'sudoku_rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.players.p2.joined) {
          setOpponentJoined(true);
        }

        if (data.status === 'playing' && gameState === 'ROOM_LOBBY') {
          setDifficulty(data.difficulty);
          const selectedPuzzle = PUZZLES[data.difficulty][data.puzzleIndex];
          setInitialBoard(copyBoard(selectedPuzzle));
          setBoard(copyBoard(selectedPuzzle));
          setSolvedBoard(solveSudoku(selectedPuzzle));
          setSelectedCell(null);
          setIsComplete(false);
          setErrorCells(new Set());
          setNotes({});
          setTimer(0);
          setTimerActive(true);
          setGameState('PLAYING');
        }

        const opponentKey = isHost ? 'p2' : 'p1';
        if (data.players[opponentKey].finished) {
          setOpponentFinished(true);
          setOpponentTime(data.players[opponentKey].time);
        }

        if (data.winner) {
          setRoomWinner(data.winner);
          setIsComplete(true);
          setTimerActive(false);
        }
      }
    });
    
    return () => unsub();
  }, [roomId, gameState, isHost]);

  // Effect to automatically start game if a random player joined your public room
  useEffect(() => {
    if (isHost && isPublic && opponentJoined && gameState === 'ROOM_LOBBY') {
      startMultiplayerGame();
    }
  }, [isHost, isPublic, opponentJoined, gameState]);

  const startGame = (level) => {
    setDifficulty(level);
    setMultiplayerMode(false);
    const index = puzzleIndices[level] % PUZZLES[level].length;
    const selectedPuzzle = PUZZLES[level][index];
    
    setInitialBoard(copyBoard(selectedPuzzle));
    setBoard(copyBoard(selectedPuzzle));
    setSolvedBoard(solveSudoku(selectedPuzzle));
    setSelectedCell(null);
    setIsComplete(false);
    setErrorCells(new Set());
    setNotes({});
    setTimer(0);
    setGameState('PLAYING');
    
    if (bestTimes[level] === null && timer === 0) {
      setShowRules(true);
      setTimerActive(false);
    } else {
      setTimerActive(true);
    }
  };

  const createMultiplayerRoom = async (publicRoom = false) => {
    try {
      const newRoomId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const level = 'medium'; // Default for multiplayer
      const puzzleIndex = Math.floor(Math.random() * PUZZLES[level].length);
      
      await setDoc(doc(db, 'sudoku_rooms', newRoomId), {
        status: 'waiting',
        difficulty: level,
        puzzleIndex: puzzleIndex,
        isPublic: publicRoom,
        players: {
          p1: { joined: true, finished: false, time: null },
          p2: { joined: false, finished: false, time: null }
        },
        winner: null,
        createdAt: serverTimestamp()
      });
      
      setRoomId(newRoomId);
      setIsHost(true);
      setIsPublic(publicRoom);
      setMultiplayerMode(true);
      setRoomWinner(null);
      setOpponentFinished(false);
      setGameState('ROOM_LOBBY');
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Ensure Firebase is configured in .env.");
      setIsSearching(false);
    }
  };

  const joinMultiplayerRoom = async (code) => {
    if (!code) return false;
    try {
      const roomRef = doc(db, 'sudoku_rooms', code);
      const roomSnap = await getDoc(roomRef);
      
      if (roomSnap.exists()) {
        const data = roomSnap.data();
        if (data.status === 'waiting' && !data.players.p2.joined) {
          await updateDoc(roomRef, {
            'players.p2.joined': true
          });
          setRoomId(code);
          setIsHost(false);
          setIsPublic(data.isPublic || false);
          setMultiplayerMode(true);
          setRoomWinner(null);
          setOpponentFinished(false);
          setGameState('ROOM_LOBBY');
          return true;
        } else {
          alert('Room is full or game already started!');
          return false;
        }
      } else {
        alert('Room not found!');
        return false;
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Ensure Firebase is configured.");
      return false;
    }
  };

  const playWithRandom = async () => {
    setIsSearching(true);
    try {
      const roomsRef = collection(db, 'sudoku_rooms');
      const q = query(roomsRef, where('status', '==', 'waiting'), where('isPublic', '==', true), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found an open public room, join it!
        const openRoom = querySnapshot.docs[0];
        const success = await joinMultiplayerRoom(openRoom.id);
        setIsSearching(false);
      } else {
        // No open public rooms found, create one and wait
        await createMultiplayerRoom(true);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error finding random match:", error);
      alert("Failed to search for match. Ensure Firebase is configured.");
      setIsSearching(false);
    }
  };

  const startMultiplayerGame = async () => {
    if (!isHost || !opponentJoined) return;
    try {
      const roomRef = doc(db, 'sudoku_rooms', roomId);
      await updateDoc(roomRef, { status: 'playing' });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const handleResetPuzzle = () => {
    if (multiplayerMode) return; // Prevent reset in race mode
    
    // Load a new puzzle by incrementing the index
    const nextIndex = (puzzleIndices[difficulty] + 1) % PUZZLES[difficulty].length;
    const newIndices = { ...puzzleIndices, [difficulty]: puzzleIndices[difficulty] + 1 };
    
    setPuzzleIndices(newIndices);
    localStorage.setItem('sudoku-puzzle-indices', JSON.stringify(newIndices));
    
    const selectedPuzzle = PUZZLES[difficulty][nextIndex];
    
    setInitialBoard(copyBoard(selectedPuzzle));
    setBoard(copyBoard(selectedPuzzle));
    setSolvedBoard(solveSudoku(selectedPuzzle));
    setSelectedCell(null);
    setIsComplete(false);
    setErrorCells(new Set());
    setNotes({});
    setTimer(0);
    setTimerActive(true);
  };

  const handleRulesAccept = () => {
    setShowRules(false);
    setTimerActive(true);
  };

  const checkValidation = (currentBoard) => {
    const errors = new Set();
    let isFull = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentBoard[r][c];
        if (val === 0) {
          isFull = false;
        } else if (solvedBoard && val !== solvedBoard[r][c]) {
          errors.add(`${r}-${c}`);
        }
      }
    }

    setErrorCells(errors);
    
    if (isFull && errors.size === 0) {
        setIsComplete(true);
        setTimerActive(false);
        
        if (multiplayerMode && roomId) {
          const me = isHost ? 'p1' : 'p2';
          const roomRef = doc(db, 'sudoku_rooms', roomId);
          
          updateDoc(roomRef, {
            [`players.${me}.finished`]: true,
            [`players.${me}.time`]: timer,
            winner: roomWinner ? roomWinner : me, 
            status: 'finished'
          }).catch(console.error);
        } else {
          if (bestTimes[difficulty] === null || timer < bestTimes[difficulty]) {
            const newBestTimes = { ...bestTimes, [difficulty]: timer };
            setBestTimes(newBestTimes);
            localStorage.setItem('sudoku-best-times', JSON.stringify(newBestTimes));
          }

          const newIndices = { ...puzzleIndices, [difficulty]: puzzleIndices[difficulty] + 1 };
          setPuzzleIndices(newIndices);
          localStorage.setItem('sudoku-puzzle-indices', JSON.stringify(newIndices));
        }
    } else {
      setIsComplete(false);
    }
  };

  const handleCellClick = (r, c) => {
    setSelectedCell({ r, c });
  };

  const isNumberComplete = (num) => {
    if (!board) return false;
    let count = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === num) count++;
      }
    }
    return count >= 9;
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || isComplete) return;
    const { r, c } = selectedCell;
    if (initialBoard[r][c] !== 0) return; // Cannot change initial cells
    
    if (num === 0) {
      if (notesMode) {
        const newNotes = { ...notes };
        delete newNotes[`${r}-${c}`];
        setNotes(newNotes);
      } else {
        const newBoard = copyBoard(board);
        newBoard[r][c] = 0;
        setBoard(newBoard);
        checkValidation(newBoard);
      }
      return;
    }

    if (notesMode) {
      const cellNotes = notes[`${r}-${c}`] || [];
      const newCellNotes = cellNotes.includes(num) 
        ? cellNotes.filter(n => n !== num)
        : [...cellNotes, num].sort();
      
      setNotes({
        ...notes,
        [`${r}-${c}`]: newCellNotes
      });
    } else {
      const newBoard = copyBoard(board);
      newBoard[r][c] = num;
      setBoard(newBoard);
      
      const newNotes = { ...notes };
      delete newNotes[`${r}-${c}`];
      setNotes(newNotes);
      
      checkValidation(newBoard);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'PLAYING' || isComplete || showRules) return; 

      if (e.key.toLowerCase() === 'n') {
        setNotesMode(prev => !prev);
      } else if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp' && selectedCell && selectedCell.r > 0) {
        setSelectedCell({ r: selectedCell.r - 1, c: selectedCell.c });
      } else if (e.key === 'ArrowDown' && selectedCell && selectedCell.r < 8) {
        setSelectedCell({ r: selectedCell.r + 1, c: selectedCell.c });
      } else if (e.key === 'ArrowLeft' && selectedCell && selectedCell.c > 0) {
        setSelectedCell({ r: selectedCell.r, c: selectedCell.c - 1 });
      } else if (e.key === 'ArrowRight' && selectedCell && selectedCell.c < 8) {
        setSelectedCell({ r: selectedCell.r, c: selectedCell.c + 1 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board, isComplete, showRules, gameState, notesMode, notes]);

  return (
    <div className="game-page" style={{ padding: '2rem' }}>
      {showRules && (
        <GameRulesModal 
          gameTitle="Sudoku" 
          rules={SUDOKU_RULES} 
          onAccept={handleRulesAccept} 
        />
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 1: MODE SELECTION */}
        {gameState === 'SELECT_MODE' && (
          <motion.div 
            key="select-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '800px', margin: '10vh auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/games')} style={{ padding: '0.5rem', marginRight: '1rem' }}>
                <ArrowLeft size={24} />
              </button>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-secondary)' }}>Back to Games</h2>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔢</div>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sudoku</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Choose how you want to play.</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                <div className="glass-card" style={{ padding: '3rem 2rem', cursor: 'pointer', height: '100%', border: '2px solid transparent' }} onClick={() => setGameState('SELECT_LEVEL')}>
                  <User size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Single Player</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Solve puzzles at your own pace and beat your best times.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                <div className="glass-card" style={{ padding: '3rem 2rem', cursor: 'pointer', height: '100%', border: '2px solid var(--color-primary)' }} onClick={() => setGameState('MULTIPLAYER_MENU')}>
                  <Users size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Multiplayer</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Race against a friend or a random opponent in real-time!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: SINGLE PLAYER LEVEL SELECTION */}
        {gameState === 'SELECT_LEVEL' && (
          <motion.div 
            key="select-level"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
              <button className="btn btn-secondary" onClick={() => setGameState('SELECT_MODE')} style={{ padding: '0.5rem', marginRight: '1rem' }}><ArrowLeft size={24} /></button>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Select Difficulty</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="glass-card" style={{ padding: '2.5rem 2rem', cursor: 'pointer', height: '100%' }} onClick={() => startGame('easy')}>
                  <Star size={40} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Easy</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Perfect for beginners.</p>
                  {bestTimes.easy !== null && <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>Best: {formatTime(bestTimes.easy)}</div>}
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="glass-card" style={{ padding: '2.5rem 2rem', cursor: 'pointer', height: '100%' }} onClick={() => startGame('medium')}>
                  <Zap size={40} color="var(--color-warning)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Medium</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>A balanced challenge.</p>
                  {bestTimes.medium !== null && <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>Best: {formatTime(bestTimes.medium)}</div>}
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="glass-card" style={{ padding: '2.5rem 2rem', cursor: 'pointer', height: '100%' }} onClick={() => startGame('hard')}>
                  <Shield size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hard</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>For Sudoku masters.</p>
                  {bestTimes.hard !== null && <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>Best: {formatTime(bestTimes.hard)}</div>}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: MULTIPLAYER MENU */}
        {gameState === 'MULTIPLAYER_MENU' && (
          <motion.div 
            key="multiplayer-menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ maxWidth: '800px', margin: '5vh auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
              <button className="btn btn-secondary" onClick={() => setGameState('SELECT_MODE')} style={{ padding: '0.5rem', marginRight: '1rem' }}><ArrowLeft size={24} /></button>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Multiplayer Matchmaking</h2>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                <div className="glass-card" style={{ padding: '3rem 2rem', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={playWithRandom}>
                  {isSearching ? (
                    <RefreshCw size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} className="spin-animation" />
                  ) : (
                    <Globe size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                  )}
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{isSearching ? 'Searching...' : 'Play with Random'}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Find an opponent anywhere in the world and race them instantly.</p>
                </div>
              </motion.div>

              <motion.div style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                <div className="glass-card" style={{ padding: '3rem 2rem', height: '100%' }}>
                  <Users size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Play with Friend</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button className="btn btn-primary full-width" onClick={() => createMultiplayerRoom(false)}>Create Private Room</button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Room Code" 
                        value={joinCodeInput} 
                        onChange={e => setJoinCodeInput(e.target.value)} 
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(128,128,128,0.3)', background: 'var(--bg-color)', color: 'var(--text-primary)', textTransform: 'uppercase' }}
                      />
                      <button className="btn btn-secondary" onClick={() => joinMultiplayerRoom(joinCodeInput.toUpperCase())}>Join</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ROOM LOBBY */}
        {gameState === 'ROOM_LOBBY' && (
          <motion.div
            key="room-lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ maxWidth: '500px', margin: '10vh auto', padding: '3rem', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{isPublic ? 'Public Matchmaking' : 'Private Lobby'}</h2>
            
            {!isPublic && (
              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block' }}>ROOM CODE</span>
                <strong style={{ fontSize: '2.5rem', letterSpacing: '4px', color: 'var(--color-primary)' }}>{roomId}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P1</div>
                <p style={{ fontWeight: 'bold' }}>{isHost ? 'You' : 'Opponent'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>VS</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '50px', height: '50px', background: opponentJoined ? 'var(--color-success)' : 'var(--text-secondary)', borderRadius: '50%', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {opponentJoined ? 'P2' : '?'}
                </div>
                <p style={{ fontWeight: 'bold', color: opponentJoined ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {opponentJoined ? (isHost ? 'Opponent' : 'You') : 'Searching...'}
                </p>
              </div>
            </div>

            {isHost && !isPublic ? (
              <button 
                className="btn btn-primary full-width" 
                onClick={startMultiplayerGame}
                disabled={!opponentJoined}
                style={{ padding: '1rem', fontSize: '1.2rem', marginBottom: '1rem', opacity: opponentJoined ? 1 : 0.5 }}
              >
                {opponentJoined ? "Start Race!" : "Waiting for Player 2..."}
              </button>
            ) : isHost && isPublic ? (
               <p style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                {opponentJoined ? 'Opponent found! Starting...' : 'Searching for a random opponent...'}
               </p>
            ) : (
              <p style={{ marginBottom: '1rem', color: 'var(--color-warning)', fontWeight: 'bold' }}>Waiting for host to start the game...</p>
            )}

            <button className="btn" onClick={() => { setRoomId(''); setMultiplayerMode(false); setGameState('MULTIPLAYER_MENU'); }}>Leave Matchmaking</button>
          </motion.div>
        )}

        {/* GAME PLAYING */}
        {gameState === 'PLAYING' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setGameState('SELECT_MODE')}>
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ margin: 0 }}>Sudoku - <span style={{ textTransform: 'capitalize', color: 'var(--color-primary)' }}>{multiplayerMode ? 'Multiplayer Race' : difficulty}</span></h2>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {multiplayerMode && (
                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--color-primary)' }}>
                    <Users size={18} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{opponentFinished ? 'Opponent Finished!' : 'Opponent Playing...'}</span>
                  </div>
                )}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                  <Timer size={18} color="var(--color-primary)" />
                  <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(timer)}</span>
                </div>

                {!multiplayerMode && (
                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                    <Trophy size={18} color="var(--color-warning, #f59e0b)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Best:</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold' }}>{formatTime(bestTimes[difficulty])}</span>
                  </div>
                )}

                <button className="btn btn-secondary" onClick={() => { setShowRules(true); setTimerActive(false); }}>
                  Rules
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              <div className="glass-card" style={{ padding: '1.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
                {isComplete && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    style={{ 
                      position: 'absolute', 
                      zIndex: 10, 
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: '#ffffff', 
                      padding: '2.5rem', 
                      borderRadius: '16px', 
                      border: multiplayerMode && roomWinner !== (isHost ? 'p1' : 'p2') ? '2px solid #ef4444' : '2px solid #10b981', 
                      textAlign: 'center', 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      minWidth: '280px'
                    }}
                  >
                    {multiplayerMode ? (
                      <>
                        <Trophy size={48} color={roomWinner === (isHost ? 'p1' : 'p2') ? "#10b981" : "#ef4444"} style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: roomWinner === (isHost ? 'p1' : 'p2') ? "#10b981" : "#ef4444", marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>
                          {roomWinner === (isHost ? 'p1' : 'p2') ? "You Won! 🎉" : "You Lost! 😔"}
                        </h3>
                        <div style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.1rem' }}>
                          <p style={{ margin: '0 0 0.5rem 0' }}>Your Time: <strong>{formatTime(timer)}</strong></p>
                          {opponentFinished && <p style={{ margin: 0 }}>Opponent Time: <strong>{formatTime(opponentTime)}</strong></p>}
                        </div>
                        <button className="btn btn-primary full-width" onClick={() => { setGameState('SELECT_MODE'); setRoomId(''); }}>Back to Menu</button>
                      </>
                    ) : (
                      <>
                        <Trophy size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: '#10b981', marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>Puzzle Solved!</h3>
                        
                        <div style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.1rem' }}>
                          <p style={{ margin: '0 0 0.5rem 0' }}>Time: <strong>{formatTime(timer)}</strong></p>
                          {bestTimes[difficulty] === timer ? (
                            <p style={{ color: '#f59e0b', fontWeight: 'bold', margin: 0 }}>🏆 New Best Time!</p>
                          ) : (
                            <p style={{ margin: 0 }}>Best Score: <strong>{formatTime(bestTimes[difficulty])}</strong></p>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <button onClick={() => startGame(difficulty)} style={{ background: '#5b21b6', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Play Again</button>
                          <button onClick={() => setGameState('SELECT_LEVEL')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Change Level</button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
                
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(9, 1fr)',
                    gridTemplateRows: 'repeat(9, 1fr)',
                    backgroundColor: '#ffffff',
                    border: '2px solid #334155',
                    width: '450px',
                    height: '450px',
                    overflow: 'hidden',
                    opacity: isComplete ? 0.4 : 1,
                    pointerEvents: isComplete ? 'none' : 'auto',
                    transition: 'opacity 0.3s'
                  }}
                >
                  {board && board.map((row, r) => 
                    row.map((cell, c) => {
                      const isInitial = initialBoard[r][c] !== 0;
                      const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                      const isError = errorCells.has(`${r}-${c}`);
                      
                      const selectedValue = selectedCell ? board[selectedCell.r][selectedCell.c] : 0;
                      
                      const inSameBlock = selectedCell && 
                        Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && 
                        Math.floor(selectedCell.c / 3) === Math.floor(c / 3);
                      
                      const isRelated = selectedCell && !isSelected && 
                        (selectedCell.r === r || selectedCell.c === c || inSameBlock);
                        
                      const hasSameNumber = selectedValue !== 0 && !isSelected && cell !== 0 && 
                        cell === selectedValue;
                      
                      const rightThick = (c === 2 || c === 5) ? '2px solid #334155' : (c === 8 ? 'none' : '1px solid #cbd5e1');
                      const bottomThick = (r === 2 || r === 5) ? '2px solid #334155' : (r === 8 ? 'none' : '1px solid #cbd5e1');
                      
                      let bgColor = '#ffffff';
                      let color = isInitial ? '#334155' : '#2563eb';

                      if (isRelated) {
                        bgColor = '#e2e8f0'; // Light slate grey for crosshair
                      }
                      if (hasSameNumber) {
                        bgColor = '#bfdbfe'; // Soft blue for matching numbers
                      }
                      if (isSelected) {
                        bgColor = '#bfdbfe'; // Soft blue for selected cell
                      }
                      if (isError) {
                        bgColor = '#fecaca';
                        color = '#dc2626';
                      }

                      return (
                        <motion.div
                          key={`${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          whileTap={{ scale: isInitial ? 1 : 0.95 }}
                          style={{
                            backgroundColor: bgColor,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            fontWeight: '400',
                            color: color,
                            cursor: 'pointer',
                            borderRight: rightThick,
                            borderBottom: bottomThick,
                            userSelect: 'none',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}
                        >
                          {cell !== 0 ? (
                            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                              {cell}
                            </motion.span>
                          ) : (
                            notes[`${r}-${c}`] && notes[`${r}-${c}`].length > 0 && (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridTemplateRows: 'repeat(3, 1fr)',
                                width: '100%',
                                height: '100%',
                                padding: '2px'
                              }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                  <div key={n} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '0.7rem',
                                    color: '#64748b',
                                    fontWeight: '700'
                                  }}>
                                    {notes[`${r}-${c}`].includes(n) ? n : ''}
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#475569', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Controls</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                      const complete = isNumberComplete(num);
                      return (
                        <motion.button 
                          key={num} 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNumberInput(num)}
                          style={{ 
                            padding: '1rem 0', 
                            fontSize: '1.5rem', 
                            fontWeight: 'bold', 
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            color: '#1e293b',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: complete ? 0.3 : 1
                          }}
                        >
                          {num}
                        </motion.button>
                      );
                    })}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNumberInput(0)}
                      style={{ 
                        gridColumn: 'span 3', 
                        padding: '0.75rem', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        backgroundColor: '#fee2e2', 
                        color: '#ef4444', 
                        border: '1px solid #fca5a5',
                        cursor: 'pointer',
                        marginTop: '0.25rem'
                      }}
                    >
                      Clear Cell
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNotesMode(!notesMode)}
                      style={{ 
                        gridColumn: 'span 3', 
                        padding: '0.75rem', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        backgroundColor: notesMode ? 'var(--color-primary)' : '#e2e8f0', 
                        color: notesMode ? 'white' : '#475569', 
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Edit2 size={18} /> {notesMode ? 'Notes: ON' : 'Notes: OFF'}
                    </motion.button>
                  </div>
                </div>

                {!multiplayerMode && (
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <button 
                      className="btn btn-secondary full-width" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
                      onClick={handleResetPuzzle}
                    >
                      <RefreshCw size={18} /> New Puzzle
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
