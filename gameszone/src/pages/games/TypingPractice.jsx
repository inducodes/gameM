import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, Undo2, RotateCw, Maximize2, Settings, ArrowRight } from 'lucide-react';
import TypingStats from '../../components/games/TypingStats';
import VirtualKeyboard from '../../components/games/VirtualKeyboard';
import './GamesLayout.css';

const ALL_KEYS = ['e','n','i','a','r','l','t','o','s','u','p','y','c','g','h','m','k','b','w','f','z','v','x','q','j'];

const DICTIONARY = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "been", "has", "had", "did", "done", "does", "am",
  // specific simple words for early letters (e, n, i, a, r, l, t)
  "in", "inn", "nine", "an", "ear", "near", "rain", "line", "train", "star", "art", "tar", "rat", "rest", "nest", "test", "tree", "street", "stone", "tone",
  "note", "not", "ton", "son", "sun", "run", "out", "our", "tour", "sour", "real", "late", "rate", "tale", "tall", "roll", "role", "tool", "root", "rot",
  "let", "net", "ten", "set", "sat", "sit", "lit", "lot", "rot", "rut", "nut", "cut", "cat", "bat", "mat", "fat", "hat", "pat", "vat", "sat"
];

const generatePracticeText = (unlockedIndex) => {
  const availableLetters = ALL_KEYS.slice(0, Math.max(3, unlockedIndex));
  
  // Filter dictionary for words that only contain available letters
  const regex = new RegExp(`^[${availableLetters.join('')}]+$`, 'i');
  let validWords = DICTIONARY.filter(word => regex.test(word) && word.length > 1);
  
  // Fallback if dictionary doesn't have enough words (e.g. just E,N,I)
  if (validWords.length === 0) {
    validWords = ["in", "inn", "nine", "nee", "en"];
  }

  const words = [];
  const numWords = 8; // Fewer words per line for quicker progression
  
  for (let i = 0; i < numWords; i++) {
    const randomWord = validWords[Math.floor(Math.random() * validWords.length)];
    words.push(randomWord);
  }
  return words.join(' ');
};

export default function TypingPractice() {
  const [unlockedIndex, setUnlockedIndex] = useState(3); // Start with 3 letters unlocked
  const [targetText, setTargetText] = useState(() => generatePracticeText(3));
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  
  // Current Line Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [score, setScore] = useState(0);
  
  // Historical Stats
  const [lessonStats, setLessonStats] = useState({
    previousSpeed: 0,
    lastSpeed: 0,
    topSpeed: 0,
    lessonCount: 0,
    totalAccuracy: 0,
    learningRate: 'Steady'
  });
  
  const [keyStats, setKeyStats] = useState({});
  const [lessonsSinceUnlock, setLessonsSinceUnlock] = useState(0);
  
  const [showModal, setShowModal] = useState(false); // We'll keep this false/unused or remove it
  // Removing modalData and showModal references below

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  const evaluateLine = useCallback((finalTyped) => {
    const minutes = (Date.now() - startTime) / 60000;
    const wordsTyped = finalTyped.length / 5;
    const finalWpm = minutes > 0 ? (wordsTyped / minutes) : 0;
    
    let correctChars = 0;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === targetText[i]) {
        correctChars++;
      }
    }
    const finalAccuracy = (correctChars / finalTyped.length) * 100;
    
    // Track per-letter hits and misses
    let newKeyStats = { ...keyStats };
    for (let i = 0; i < finalTyped.length; i++) {
      const targetChar = targetText[i];
      if (targetChar === ' ') continue; // Skip spaces
      
      if (!newKeyStats[targetChar]) {
        newKeyStats[targetChar] = { hits: 0, misses: 0 };
      }
      if (finalTyped[i] === targetChar) {
        newKeyStats[targetChar].hits++;
      } else {
        newKeyStats[targetChar].misses++;
      }
    }
    setKeyStats(newKeyStats);

    const newLessonsSinceUnlock = lessonsSinceUnlock + 1;
    let nextIndex = unlockedIndex;
    let nextLearningRate = lessonStats.learningRate;
    
    // Evaluate if ready to unlock next letter
    const currentLearningLetter = ALL_KEYS[unlockedIndex - 1];
    const learningLetterStats = newKeyStats[currentLearningLetter] || { hits: 0, misses: 0 };
    const totalStrokes = learningLetterStats.hits + learningLetterStats.misses;
    const missRate = totalStrokes > 0 ? (learningLetterStats.misses / totalStrokes) : 1;

    const meetsUnlockCriteria = 
      newLessonsSinceUnlock >= 3 && 
      finalWpm >= 25 && 
      finalAccuracy >= 92 && 
      totalStrokes >= 5 &&
      missRate <= 0.15;
    
    if (meetsUnlockCriteria) {
      nextIndex = Math.min(ALL_KEYS.length, unlockedIndex + 1);
      nextLearningRate = 'Fast';
      setLessonsSinceUnlock(0); // Reset for the newly unlocked letter
    } else {
      setLessonsSinceUnlock(newLessonsSinceUnlock);
      if (finalWpm >= 25 && finalAccuracy >= 92) {
        nextLearningRate = 'Steady';
      } else {
        nextLearningRate = 'Needs Practice';
      }
    }

    const newLessonCount = lessonStats.lessonCount + 1;
    const newTotalAccuracy = lessonStats.totalAccuracy + finalAccuracy;

    setLessonStats({
      previousSpeed: lessonStats.lastSpeed,
      lastSpeed: finalWpm,
      topSpeed: Math.max(lessonStats.topSpeed, finalWpm),
      lessonCount: newLessonCount,
      totalAccuracy: newTotalAccuracy,
      learningRate: nextLearningRate
    });

    setUnlockedIndex(nextIndex);
    setTargetText(generatePracticeText(nextIndex));
    setTyped('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
  }, [startTime, targetText, unlockedIndex, lessonStats, keyStats, lessonsSinceUnlock]);

  useEffect(() => {
    if (typed.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (typed.length > 0 && startTime) {
      const minutes = (Date.now() - startTime) / 60000;
      if (minutes > 0) {
        const wordsTyped = typed.length / 5;
        setWpm(wordsTyped / minutes);
      }
      
      let correctChars = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === targetText[i]) {
          correctChars++;
        }
      }
      setAccuracy((correctChars / typed.length) * 100);
      setScore(prev => prev + (typed[typed.length - 1] === targetText[typed.length - 1] ? 1 : 0));
    }

    if (typed.length === targetText.length && targetText.length > 0) {
      evaluateLine(typed);
    }
  }, [typed, startTime, targetText, evaluateLine]);

  const handleKeyDown = (e) => {
    // Allow basic browser shortcuts and meta keys
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Shift' || e.key === 'CapsLock' || e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') return;
    
    // Prevent default to completely block backspace and standard typing
    e.preventDefault();
    
    if (e.key === 'Backspace') {
      return; // Do nothing, backspace is disabled
    }
    
    // If not at the end of the text, append the pressed key
    // We only accept printable characters (length 1)
    if (typed.length < targetText.length && e.key.length === 1) {
      setTyped(prev => prev + e.key.toLowerCase());
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const reset = () => {
    setTyped('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTargetText(generatePracticeText(unlockedIndex));
    inputRef.current?.focus();
  };

  // Removed handleNextLesson since it's now in evaluateLine

  const getNextKey = () => {
    if (typed.length < targetText.length) {
      return targetText[typed.length];
    }
    return null;
  };

  return (
    <div className="game-page typing-practice-page">
      <div className="typing-header-actions">
        <button className="icon-btn"><HelpCircle size={20} /></button>
        <button className="icon-btn"><Undo2 size={20} /></button>
        <button className="icon-btn" onClick={reset}><RotateCw size={20} /></button>
        <button className="icon-btn"><Maximize2 size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>
      </div>

      <TypingStats 
        wpm={wpm} 
        accuracy={accuracy} 
        score={score} 
        nextKey={getNextKey()} 
        unlockedIndex={unlockedIndex}
        lessonStats={lessonStats}
        keyStats={keyStats}
      />

      <div className="typing-text-container" onClick={handleContainerClick}>
        <input 
          ref={inputRef}
          type="text" 
          onKeyDown={handleKeyDown}
          className="hidden-typing-input"
          autoFocus
        />
        
        <div className="typing-area-inner">
          <div className="typing-text-display">
          {targetText.split('').map((char, index) => {
            let stateClass = '';
            if (index < typed.length) {
              stateClass = typed[index] === char ? 'correct' : 'incorrect';
            } else if (index === typed.length) {
              stateClass = 'current';
            }

            return (
              <span key={index} className={`typing-char ${stateClass}`}>
                {char === ' ' ? '·' : char}
              </span>
            );
          })}
          </div>
        </div>
      </div>

      <VirtualKeyboard nextKey={getNextKey()} />
    </div>
  );
}
