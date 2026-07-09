import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import History from './pages/History';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import ChessGame from './pages/games/ChessGame';
import SqlChallenge from './pages/games/SqlChallenge';
import PythonQuiz from './pages/games/PythonQuiz';
import TypingPractice from './pages/games/TypingPractice';
import TicTacToe from './pages/games/TicTacToe';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="games" element={<Games />} />
          <Route path="games/chess" element={<ChessGame />} />
          <Route path="games/sql" element={<SqlChallenge />} />
          <Route path="games/python" element={<PythonQuiz />} />
          <Route path="games/typing" element={<TypingPractice />} />
          <Route path="games/tictactoe" element={<TicTacToe />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="history" element={<History />} />
          <Route path="friends" element={<Friends />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
