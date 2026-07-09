import { motion } from 'framer-motion';
import { BookOpen, X, Check } from 'lucide-react';
import './GameRulesModal.css';

export default function GameRulesModal({ gameTitle, rules, onAccept }) {
  return (
    <div className="rules-modal-overlay">
      <motion.div 
        className="rules-modal glass-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="rules-header">
          <BookOpen className="rules-icon" size={24} />
          <h2>{gameTitle} Rules</h2>
        </div>
        <div className="rules-content">
          <ul>
            {rules.map((rule, idx) => (
              <li key={idx}>
                <Check size={16} className="text-success" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rules-footer">
          <button className="btn btn-primary full-width" onClick={onAccept}>
            I Understand, Let's Play!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
