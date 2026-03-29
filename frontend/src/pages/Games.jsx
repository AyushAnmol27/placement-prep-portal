import { useState, useEffect, useCallback, useRef } from 'react';

// ─── GAME 1: Memory Card Match ───────────────────────────────────────────
const CARD_EMOJIS = ['🧠', '💡', '🔥', '⚡', '🎯', '🚀', '💻', '🏆'];
const MemoryGame = ({ onClose }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef(null);

  const initCards = useCallback(() => {
    const deck = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .map((emoji, id) => ({ id, emoji, key: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setStarted(false);
    setWon(false);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => { initCards(); return () => clearInterval(timerRef.current); }, [initCards]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        const newMatched = [...matched, cards[a].emoji];
        setMatched(newMatched);
        if (newMatched.length === CARD_EMOJIS.length) { setWon(true); clearInterval(timerRef.current); }
        setTimeout(() => setFlipped([]), 300);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, matched, cards]);

  const flip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].emoji)) return;
    if (!started) {
      setStarted(true);
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    setFlipped(f => [...f, idx]);
  };

  return (
    <div className="animate-fade">
      <div className="flex-between mb-3">
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>🧠 Memory Match</h3>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>⏱ {time}s</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>🎯 {moves} moves</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>✅ {matched.length}/{CARD_EMOJIS.length}</span>
        </div>
      </div>
      {won && (
        <div style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff', fontWeight: 700, animation: 'float 3s ease-in-out infinite' }}>
          🎉 You won in {moves} moves and {time} seconds! Amazing memory!
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.emoji);
          return (
            <div
              key={card.key}
              onClick={() => flip(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                cursor: 'pointer',
                background: isFlipped ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-elevated)',
                border: `2px solid ${isFlipped ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, box-shadow 0.3s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                boxShadow: isFlipped ? '0 10px 25px rgba(99,102,241,0.5)' : 'none',
                userSelect: 'none',
              }}
            >
              <div style={{ transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}>
                {isFlipped ? card.emoji : '❓'}
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary btn-full" onClick={initCards} style={{ padding: '0.8rem' }}>🔄 New Game</button>
    </div>
  );
};

// ─── GAME 2: Typing Speed Test ────────────────────────────────────────────
const DSA_WORDS = ['array', 'linked', 'stack', 'queue', 'binary', 'search', 'graph', 'tree', 'heap', 'hash', 'sort', 'merge', 'quick', 'depth', 'breadth', 'dynamic', 'greedy', 'pointer', 'node', 'vertex', 'edge', 'cycle', 'path', 'index', 'pivot', 'matrix', 'vector', 'iterator', 'recursion', 'trie'];
const TypingGame = ({ onClose }) => {
  const [words, setWords] = useState([]);
  const [typed, setTyped] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [time, setTime] = useState(60);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const initGame = useCallback(() => {
    const shuffled = [...DSA_WORDS].sort(() => Math.random() - 0.5);
    const repeated = [...shuffled, ...shuffled, ...shuffled];
    setWords(repeated);
    setTyped('');
    setWordIdx(0);
    setCorrect(0);
    setWrong(0);
    setTime(60);
    setStarted(false);
    setEnded(false);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => { initGame(); return () => clearInterval(timerRef.current); }, [initGame]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleType = (e) => {
    const val = e.target.value;
    if (!started && val.length > 0) {
      setStarted(true);
      timerRef.current = setInterval(() => {
        setTime(t => {
          if (t <= 1) { clearInterval(timerRef.current); setEnded(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    if (val.endsWith(' ')) {
      const word = val.trim();
      if (word === words[wordIdx]) setCorrect(c => c + 1);
      else setWrong(w => w + 1);
      setWordIdx(i => i + 1);
      setTyped('');
    } else {
      setTyped(val);
    }
  };

  const wpm = Math.round((correct / (60 - time || 1)) * 60);
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 100;

  return (
    <div className="animate-fade">
      <div className="flex-between mb-3">
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>⌨️ DSA Typing Speed</h3>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <span style={{ color: time < 10 ? 'var(--danger)' : 'var(--warning)', fontWeight: 800, background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>⏱ {time}s</span>
          <span style={{ color: 'var(--success)', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>✅ {correct}</span>
          <span style={{ color: 'var(--danger)', fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>❌ {wrong}</span>
        </div>
      </div>
      {ended ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🏁</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', lineHeight: 1 }}>{wpm} WPM</div>
          <div style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Accuracy: <strong style={{color:'#fff'}}>{accuracy}%</strong> · Correct: <strong style={{color:'var(--success)'}}>{correct}</strong> · Wrong: <strong style={{color:'var(--danger)'}}>{wrong}</strong></div>
          <button className="btn btn-primary" onClick={initGame} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Play Again 🔁</button>
        </div>
      ) : (
        <>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem', lineHeight: 2.2, fontSize: '1.1rem', fontFamily: "'Fira Code', monospace", maxHeight: '140px', overflow: 'hidden', position: 'relative' }}>
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg-elevated) 100%)', pointerEvents: 'none' }} />
            {words.slice(Math.max(0, wordIdx - 5), wordIdx + 15).map((w, i) => {
              const realIdx = i + Math.max(0, wordIdx - 5);
              const isCurrent = realIdx === wordIdx;
              const isDone = realIdx < wordIdx;
              return (
                <span key={realIdx} style={{
                  marginRight: '0.75rem',
                  display: 'inline-block',
                  color: isCurrent ? 'var(--primary)' : isDone ? 'var(--text-faint)' : 'var(--text)',
                  background: isCurrent ? 'rgba(99,102,241,0.15)' : 'transparent',
                  borderRadius: '4px',
                  padding: '0 4px',
                  fontWeight: isCurrent ? 800 : 500,
                  transition: 'all 0.2s',
                  position: 'relative',
                  transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                }}>
                  {w}
                  {isDone && <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--text-faint)', transform: 'translateY(-50%)' }}/>}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={handleType}
            disabled={ended}
            placeholder="Start typing DSA words here..."
            style={{ fontFamily: "'Fira Code', monospace", fontSize: '1.25rem', padding: '1rem 1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '2px solid var(--border)' }}
            autoComplete="off" spellCheck="false"
          />
        </>
      )}
    </div>
  );
};

// ─── GAME 3: DSA Quiz ─────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], ans: 1 },
  { q: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Heap', 'Linked List'], ans: 1 },
  { q: 'What is the space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ans: 2 },
  { q: 'Which algorithm is used to find shortest path in a weighted graph?', options: ['BFS', 'DFS', 'Dijkstra', 'Floyd-Warshall'], ans: 2 },
  { q: 'What is the average time complexity of Quick Sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], ans: 1 },
  { q: 'Which traversal visits a tree Level by Level?', options: ['In-order', 'Pre-order', 'Post-order', 'BFS'], ans: 3 },
  { q: 'What data structure is used in BFS?', options: ['Stack', 'Queue', 'Heap', 'Array'], ans: 1 },
  { q: 'Time complexity of inserting in a Hash Table (avg)?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], ans: 0 },
  { q: 'Which sorting algorithm is in-place and has O(n log n) worst case?', options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bucket Sort'], ans: 2 },
  { q: 'What is a Trie used for?', options: ['Sorting integers', 'Prefix-based string search', 'Finding shortest path', 'Hashing keys'], ans: 1 },
];
const QuizGame = ({ onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [ended, setEnded] = useState(false);
  const [answered, setAnswered] = useState(false);

  const initQuiz = useCallback(() => {
    setQuestions([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setEnded(false);
    setAnswered(false);
  }, []);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].ans) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setEnded(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (!questions.length) return null;
  const q = questions[current];
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="animate-fade">
      <div className="flex-between mb-3">
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>🎓 DSA Quiz</h3>
        {!ended && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>{current + 1} / {questions.length} · Score: <strong style={{color:'#fff'}}>{score}</strong></span>}
      </div>
      {ended ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)', marginBottom: '0.5rem', lineHeight: 1 }}>
            {score}/{questions.length}
          </div>
          <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            {pct >= 80 ? 'Excellent! You know DSA well! 🌟' : pct >= 50 ? 'Good job! Keep practicing! 💪' : 'Keep studying! You\'ll get there! 📖'}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', marginBottom: '2rem' }}>{pct}%</div>
          <button className="btn btn-primary" onClick={initQuiz} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Try Again 🔁</button>
        </div>
      ) : (
        <>
          <div className="progress-bar mb-4" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%`, background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(31,37,55,0.7), rgba(18,27,52,0.9))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.6, margin: 0, color: '#fff' }}>{q.q}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {q.options.map((opt, i) => {
              let bg = 'var(--bg-card)', color = 'var(--text)', border = '1.5px solid rgba(255,255,255,0.1)';
              let icon = <span style={{display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', fontSize: '0.8rem', marginRight: '0.75rem'}}>{String.fromCharCode(65 + i)}</span>;
              
              if (answered) {
                if (i === q.ans) { bg = 'var(--success-bg)'; color = 'var(--success)'; border = '1.5px solid rgba(34,197,94,0.4)'; icon = <span style={{marginRight:'0.75rem', fontSize:'1.1rem'}}>✅</span>; }
                else if (i === selected) { bg = 'var(--danger-bg)'; color = 'var(--danger)'; border = '1.5px solid rgba(239,68,68,0.4)'; icon = <span style={{marginRight:'0.75rem', fontSize:'1.1rem'}}>❌</span>; }
              } else if (i === selected) { bg = 'var(--primary-light)'; border = '1.5px solid var(--primary)'; }
              
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: bg, color, border, textAlign: 'left', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', fontFamily: 'inherit', fontWeight: answered && i === q.ans ? 800 : 500 }}
                  onMouseEnter={e => { if(!answered) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { if(!answered) e.currentTarget.style.background = bg; }}
                >
                  {icon} {opt}
                </button>
              );
            })}
          </div>
          {answered && (
            <button className="btn btn-primary btn-full" onClick={next} style={{ padding: '0.9rem', fontSize: '1rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>
              {current + 1 >= questions.length ? 'See Results 🏁' : 'Next Question →'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

// ─── GAME 4: Number Puzzle (2048-style mini) ──────────────────────────────
const PuzzleGame = ({ onClose }) => {
  const [board, setBoard] = useState(() => initBoard());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('puzzle_best') || '0'));
  const [gameOver, setGameOver] = useState(false);

  function initBoard() {
    const b = Array(16).fill(0);
    addRandom(b); addRandom(b);
    return b;
  }
  function addRandom(b) {
    const empty = b.reduce((acc, v, i) => v === 0 ? [...acc, i] : acc, []);
    if (!empty.length) return;
    b[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
  }

  const slide = (dir) => {
    let b = [...board];
    let gained = 0;
    const rows = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
    const cols = [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];
    const lines = (dir === 'left' || dir === 'right') ? rows : cols;
    const reverse = dir === 'right' || dir === 'down';

    lines.forEach(line => {
      let indices = reverse ? [...line].reverse() : [...line];
      let vals = indices.map(i => b[i]).filter(v => v !== 0);
      for (let i = 0; i < vals.length - 1; i++) {
        if (vals[i] === vals[i + 1]) { vals[i] *= 2; gained += vals[i]; vals.splice(i + 1, 1); }
      }
      while (vals.length < 4) vals.push(0);
      indices.forEach((idx, i) => b[idx] = vals[i]);
    });

    addRandom(b);
    const newScore = score + gained;
    setScore(newScore);
    if (newScore > best) { setBest(newScore); localStorage.setItem('puzzle_best', newScore); }
    setBoard(b);
    if (b.every(v => v !== 0)) setGameOver(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[e.key]) { e.preventDefault(); slide(map[e.key]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [board, score]);

  const tileColors = { 0: 'rgba(255,255,255,0.03)', 2: '#334155', 4: '#475569', 8: '#f59e0b', 16: '#f97316', 32: '#ef4444', 64: '#ec4899', 128: '#8b5cf6', 256: '#6366f1', 512: '#06b6d4', 1024: '#22c55e', 2048: '#eab308' };
  const getColor = (v) => tileColors[v] || '#1d4a3a';

  return (
    <div className="animate-fade">
      <div className="flex-between mb-3">
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>🔢 2048 Number Puzzle</h3>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Score</div>
             <div style={{ fontWeight: 800, color: '#fff', lineHeight: 1 }}>{score}</div>
          </div>
          <div style={{ background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', color: 'var(--warning)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Best</div>
             <div style={{ fontWeight: 800, color: 'var(--warning)', lineHeight: 1 }}>{best}</div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Use arrow keys to slide tiles. Merge matching numbers to reach 2048!</p>
      {gameOver && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius)', textAlign: 'center', fontWeight: 700, marginBottom: '1rem' }}>Game Over! Final Score: {score}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', background: 'var(--bg-elevated)', padding: '0.8rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
        {board.map((val, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: 'var(--radius-sm)',
            background: getColor(val),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: val >= 1000 ? '1.1rem' : '1.5rem',
            color: val === 0 ? 'transparent' : val <= 4 ? '#cbd5e1' : '#fff',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: val >= 128 ? '0 0 20px rgba(99,102,241,0.5), inset 0 0 10px rgba(255,255,255,0.2)' : val > 0 ? 'inset 0 0 10px rgba(255,255,255,0.1)' : 'none',
            textShadow: val > 4 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
          }}>
            {val || ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={() => { setBoard(initBoard()); setScore(0); setGameOver(false); }} style={{ padding: '0.6rem 1.5rem' }}>🔄 Restart</button>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['←', '→', '↑', '↓'].map((arrow, i) => {
            const dirs = ['left', 'right', 'up', 'down'];
            return <button key={i} className="btn btn-ghost" onClick={() => slide(dirs[i])} style={{ fontSize: '1.2rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)' }}>{arrow}</button>;
          })}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN GAMES PAGE ──────────────────────────────────────────────────────
const GAMES = [
  { id: 'memory', title: '🧠 Memory Match', desc: 'Find matching pairs of DSA concept cards. Test your memory!', difficulty: 'Easy', component: MemoryGame, color: '#8b5cf6' },
  { id: 'typing', title: '⌨️ DSA Typing Speed', desc: 'Type DSA keywords as fast as you can. Improve your coding speed!', difficulty: 'Medium', component: TypingGame, color: '#0ea5e9' },
  { id: 'quiz', title: '🎓 DSA Quiz', desc: 'Test your algorithm knowledge with timed multiple-choice questions.', difficulty: 'Medium', component: QuizGame, color: '#f43f5e' },
  { id: 'puzzle', title: '🔢 2048 Puzzle', desc: 'Slide tiles and combine numbers to reach 2048. Think strategically!', difficulty: 'Hard', component: PuzzleGame, color: '#f59e0b' },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const Game = GAMES.find(g => g.id === activeGame)?.component;

  return (
    <div className="animate-fade" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: -50, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>
            🎮 Play & Learn
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Brain <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Games</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Sharpen your memory, speed, and DSA logic with interactive mini-games.</p>
        </div>
        {activeGame && (
          <button className="btn btn-ghost" onClick={() => setActiveGame(null)} style={{ position: 'relative', zIndex: 1, padding: '0.6rem 1.25rem' }}>
            ← Back to Arcade
          </button>
        )}
      </div>

      {!activeGame ? (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {GAMES.map((game, i) => (
            <div
              key={game.id}
              className="card card-hover"
              onClick={() => setActiveGame(game.id)}
              style={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(31,37,55,0.6) 0%, rgba(18,27,52,0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative', overflow: 'hidden',
                animation: `slideUp 0.4s ease ${i * 0.1}s backwards`,
                padding: '2rem 1.75rem'
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: `radial-gradient(circle at top right, ${game.color}25, transparent 70%)` }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '1rem',
                  background: `linear-gradient(135deg, ${game.color}20, ${game.color}10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                  border: `1px solid ${game.color}40`,
                  boxShadow: `0 0 20px ${game.color}20`,
                }}>
                  {game.title.split(' ')[0]}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>{game.title.substring(2)}</h3>
                  <span className={`badge badge-${game.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, height: '40px' }}>{game.desc}</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ color: game.color, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                   Start Game <span style={{ fontSize: '1.1rem' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card animate-slide" style={{ maxWidth: '640px', margin: '0 auto', background: 'rgba(31,37,55,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)', padding: '2rem' }}>
          {Game && <Game onClose={() => setActiveGame(null)} />}
        </div>
      )}
    </div>
  );
};

export default Games;
