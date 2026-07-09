import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Database, Table, HelpCircle, Trophy } from 'lucide-react';
import GameRulesModal from '../../components/games/GameRulesModal';
import './GamesLayout.css';

const SQL_RULES = [
  "Read the schema to understand the database structure.",
  "Write a SQL query that fulfills the objective.",
  "Click 'Run Query' to validate your answer.",
  "Get +100 XP for the correct solution."
];

export default function SqlChallenge() {
  const [showRules, setShowRules] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [passed, setPassed] = useState(false);

  const runQuery = () => {
    const q = query.trim().toLowerCase();
    // very basic validation for this challenge
    if (q.includes("select") && q.includes("from users") && q.includes("order by score desc") && q.includes("limit 5")) {
      setResults([
        { id: 102, username: 'ProGamer', score: 9850, country: 'IN' },
        { id: 45, username: 'CodeNinja', score: 9200, country: 'US' },
        { id: 8, username: 'AlexD', score: 8900, country: 'UK' },
        { id: 311, username: 'Sriram', score: 8750, country: 'IN' },
        { id: 19, username: 'Maria', score: 8400, country: 'BR' }
      ]);
      setError(null);
      setPassed(true);
    } else {
      setResults(null);
      setError("Incorrect query. Ensure you are selecting from 'users', ordering by 'score' descending, and limiting to 5.");
      setPassed(false);
    }
  };

  return (
    <motion.div 
      className="game-container sql-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showRules && (
        <GameRulesModal 
          gameTitle="SQL Data Challenge" 
          rules={SQL_RULES} 
          onAccept={() => setShowRules(false)} 
        />
      )}

      <div className="game-sidebar">
        <div className="glass-card" style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            <Database size={24} />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Challenge Info</h2>
          </div>
          
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Objective:</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Write a query to find the top 5 players with the highest scores from the <code>users</code> table.
          </p>

          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={16} /> Schema (users)
          </h3>
          <div className="mono" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>id INT PK</div>
            <div style={{ marginBottom: '0.25rem' }}>username VARCHAR(50)</div>
            <div style={{ marginBottom: '0.25rem' }}>score INT</div>
            <div>country VARCHAR(2)</div>
          </div>

          {passed && (
            <div className="glass-card text-center" style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-success)' }}>
              <Trophy size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: 'var(--color-success)', margin: '0 0 0.5rem 0' }}>Challenge Passed!</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>+100 XP Earned</p>
              <button className="btn btn-primary btn-sm full-width" style={{ marginTop: '1rem' }} onClick={() => window.location.href='/'}>Return to Dashboard</button>
            </div>
          )}
        </div>
      </div>

      <div className="sql-main">
        <div className="sql-editor-area shadow-lg">
          <div className="editor-header">
            <span>query.sql</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>PostgreSQL 14</span>
              <button className="btn btn-primary btn-sm" onClick={runQuery}><Play size={14} /> Run Query</button>
            </div>
          </div>
          <textarea 
            className="sql-textarea"
            placeholder="SELECT * FROM users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
        </div>

        {(results || error) && (
          <motion.div 
            className="sql-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 style={{ margin: '0 0 1rem 0' }}>Results</h3>
            
            {error && (
              <div style={{ color: 'var(--color-danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}

            {results && (
              <div style={{ overflowX: 'auto' }}>
                <table className="sql-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>username</th>
                      <th>score</th>
                      <th>country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.id}</td>
                        <td>{row.username}</td>
                        <td className="mono">{row.score}</td>
                        <td>{row.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
