import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle, CheckCircle, XCircle, Trophy } from 'lucide-react';
import GameRulesModal from '../../components/games/GameRulesModal';
import './GamesLayout.css';

const PYTHON_RULES = [
  "You have 3 questions to answer in this quiz.",
  "Select the correct answer from the multiple choices.",
  "Each correct answer awards you 25 XP.",
  "There is no time limit, but accuracy matters.",
  "You must score at least 50 XP to pass the challenge."
];

const QUESTIONS = [
  {
    id: 1,
    question: "What is the output of the following code?",
    code: "def add(a, b=[]):\n    b.append(a)\n    return b\n\nprint(add(1))\nprint(add(2))",
    options: ["[1], [2]", "[1], [1, 2]", "[1], [2, 1]", "Error"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of these is not a core data type in Python?",
    code: null,
    options: ["Lists", "Dictionary", "Tuples", "Class"],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What does `type(lambda: None)` return?",
    code: null,
    options: ["<class 'function'>", "<class 'lambda'>", "<class 'NoneType'>", "Error"],
    correctAnswer: 0
  }
];

export default function PythonQuiz() {
  const [showRules, setShowRules] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUESTIONS[currentQuestionIdx];

  const handleOptionSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === question.correctAnswer) {
      setScore(s => s + 25);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <motion.div 
      className="game-container quiz-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showRules && (
        <GameRulesModal 
          gameTitle="Python Quiz" 
          rules={PYTHON_RULES} 
          onAccept={() => setShowRules(false)} 
        />
      )}

      {!showRules && !quizFinished && (
        <div className="quiz-main glass-card">
          <div className="quiz-header">
            <div className="quiz-progress">
              <span>Question {currentQuestionIdx + 1} of {QUESTIONS.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="quiz-score">Score: {score} XP</div>
          </div>

          <div className="question-section">
            <h3>{question.question}</h3>
            {question.code && (
              <pre className="code-block mono">
                <code>{question.code}</code>
              </pre>
            )}
          </div>

          <div className="options-grid">
            {question.options.map((opt, idx) => {
              let btnClass = "option-btn";
              if (isAnswered) {
                if (idx === question.correctAnswer) btnClass += " correct";
                else if (idx === selectedOption) btnClass += " incorrect";
              } else if (idx === selectedOption) {
                btnClass += " selected";
              }

              return (
                <button 
                  key={idx} 
                  className={btnClass}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt}</span>
                  {isAnswered && idx === question.correctAnswer && <CheckCircle size={18} className="icon-right" />}
                  {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle size={18} className="icon-right" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="quiz-footer">
              <button className="btn btn-primary" onClick={nextQuestion}>
                {currentQuestionIdx < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {quizFinished && (
        <div className="quiz-main glass-card text-center" style={{ padding: '4rem 2rem' }}>
          <Trophy size={64} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
          <h2>Quiz Completed!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You scored {score} XP</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return to Dashboard</button>
        </div>
      )}
      
      {!showRules && !quizFinished && (
        <div className="game-sidebar">
          <div className="hint-card glass-card">
            <div className="hint-header">
              <HelpCircle size={20} color="var(--color-secondary)" />
              <h3>Need a Hint?</h3>
            </div>
            <p>Take your time. Read the code carefully, especially regarding mutable default arguments in Python.</p>
            <button className="btn btn-secondary btn-sm full-width" style={{ marginTop: '1rem' }}>Show Hint (-5 XP)</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
