import { useEffect, useState, useRef } from 'react';
import { getTests, getTest, submitTest, getTestLeaderboard } from '../services/testService';
import Loader from '../components/common/Loader';

/* ── Static Coding Challenges per difficulty ─────────────────────── */
const CODING_CHALLENGES = {
  Easy: [
    {
      title: 'Reverse a String',
      description: 'Write a function that takes a string as input and returns the reversed string. Do not use built-in reverse methods.',
      examples: 'Input: "hello" → Output: "olleh"\nInput: "world" → Output: "dlrow"',
      starterCode: `function reverseString(s) {\n  // Write your solution here\n  \n}`,
    },
    {
      title: 'Check Palindrome',
      description: 'Given a string, determine if it reads the same forwards and backwards (case-insensitive, ignore spaces).',
      examples: 'Input: "racecar" → Output: true\nInput: "hello" → Output: false',
      starterCode: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
    },
  ],
  Medium: [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of two numbers that add up to target. Each input has exactly one solution.',
      examples: 'Input: nums=[2,7,11,15], target=9 → Output: [0,1]\nInput: nums=[3,2,4], target=6 → Output: [1,2]',
      starterCode: `function twoSum(nums, target) {\n  // Optimal: O(n) using HashMap\n  \n}`,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      examples: 'Input: "abcabcbb" → Output: 3 ("abc")\nInput: "bbbbb" → Output: 1 ("b")',
      starterCode: `function lengthOfLongestSubstring(s) {\n  // Hint: Sliding window approach\n  \n}`,
    },
  ],
  Hard: [
    {
      title: 'Median of Two Sorted Arrays',
      description: 'Given two sorted arrays nums1 and nums2, return the median of the two arrays merged. Time complexity must be O(log(m+n)).',
      examples: 'Input: nums1=[1,3], nums2=[2] → Output: 2.0\nInput: nums1=[1,2], nums2=[3,4] → Output: 2.5',
      starterCode: `function findMedianSortedArrays(nums1, nums2) {\n  // Binary search approach required\n  \n}`,
    },
    {
      title: 'LRU Cache',
      description: 'Implement a Least Recently Used (LRU) cache class with get(key) and put(key, val) operations. Both must run in O(1). Capacity is fixed.',
      examples: 'cache = LRUCache(2)\ncache.put(1,1); cache.put(2,2);\ncache.get(1) → 1\ncache.put(3,3); // evicts key 2\ncache.get(2) → -1',
      starterCode: `class LRUCache {\n  constructor(capacity) {\n    // Use HashMap + DoublyLinkedList\n  }\n  get(key) { }\n  put(key, val) { }\n}`,
    },
  ],
};

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const DIFF_STYLE = {
  Easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  Hard: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
};

/* ── Circular Progress Ring ─────────────────────────────────────── */
const CircleProgress = ({ value, max, size = 64, label, color = 'var(--primary)' }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = max > 0 ? (value / max) * circ : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={6} strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontSize={size * 0.22} fontWeight={800}
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}>
          {value}/{max}
        </text>
      </svg>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
    </div>
  );
};

/* ── Code Editor Panel ───────────────────────────────────────────── */
const CodeEditor = ({ challenge, idx, code, onChange }) => {
  const [output, setOutput] = useState('');
  const [ran, setRan] = useState(false);

  const runCode = () => {
    setRan(true);
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code + '\n// test run');
      fn();
      setOutput('✅ Code ran without syntax errors. Submit to evaluate logic.');
    } catch (e) {
      setOutput(`❌ Error: ${e.message}`);
    }
  };

  return (
    <div className="card" style={{ marginTop: '1rem', border: '1px solid rgba(99,102,241,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '6px', padding: '0.15rem 0.5rem', fontWeight: 700 }}>
            CODING CHALLENGE {idx + 1}
          </span>
          <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '0.35rem' }}>{challenge.title}</h4>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '0.65rem' }}>{challenge.description}</p>
      <pre style={{ fontSize: '0.75rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius)', padding: '0.65rem 0.9rem', marginBottom: '0.75rem', whiteSpace: 'pre-wrap', color: '#06b6d4' }}>
        {challenge.examples}
      </pre>
      <textarea
        value={code}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        style={{
          fontFamily: "'Fira Code', monospace", fontSize: '0.82rem',
          background: 'rgba(13,17,23,0.9)', color: '#e2e8f0',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '0.85rem', width: '100%', minHeight: 160,
          resize: 'vertical', lineHeight: 1.7, outline: 'none',
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={runCode}>▶ Run Code</button>
        {ran && <span style={{ fontSize: '0.78rem', color: output.startsWith('✅') ? 'var(--success)' : 'var(--danger)' }}>{output}</span>}
      </div>
    </div>
  );
};

/* ── Main MockTests Component ───────────────────────────────────── */
const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diffTab, setDiffTab] = useState('');
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [codes, setCodes] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [showLB, setShowLB] = useState(false);
  const startTime = useRef(null);
  const timerRef = useRef(null);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const params = {};
    if (diffTab) params.difficulty = diffTab;
    setLoading(true);
    getTests(params).then(setTests).finally(() => setLoading(false));
  }, [diffTab]);

  useEffect(() => {
    if (!activeTest || result) return;
    setTimeLeft(activeTest.duration * 60);
    startTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeTest]);

  const startTest = async (id) => {
    setResult(null); setAnswers({}); setCodes({}); setLeaderboard(null); setShowLB(false);
    const test = await getTest(id);
    setActiveTest(test);
    // Assign 2 coding challenges based on difficulty
    const diff = test.difficulty || diffTab || 'Medium';
    const pool = CODING_CHALLENGES[diff] || CODING_CHALLENGES.Medium;
    setChallenges(pool);
    const initCodes = {};
    pool.forEach((c, i) => { initCodes[i] = c.starterCode; });
    setCodes(initCodes);
  };

  const handleSubmit = async () => {
    if (submitting || !activeTest) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const answersArr = activeTest.questions.map((_, i) => answers[i] ?? -1);
      const res = await submitTest(activeTest._id, answersArr, timeTaken);
      setResult(res);
    } finally { setSubmitting(false); }
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answered = Object.keys(answers).length;
  const total = activeTest?.questions?.length || 0;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const isLow = (timeLeft || 0) < 120;

  /* ── Active Test View ── */
  if (activeTest && !result) return (
    <div className="animate-fade">
      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: 'var(--navbar-height)', zIndex: 20,
        background: 'rgba(8,12,24,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '0.75rem 0', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>{activeTest.title}</h2>
          <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>{activeTest.category}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <CircleProgress value={answered} max={total} size={60} label="MCQs" color="var(--success)" />
          {/* Timer */}
          <div style={{
            background: isLow ? 'rgba(239,68,68,0.12)' : 'var(--bg-card)',
            border: `1px solid ${isLow ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '0.6rem 1rem', textAlign: 'center',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isLow ? 'var(--danger)' : 'var(--warning)', letterSpacing: '0.04em', lineHeight: 1 }}>
              ⏱ {fmt(timeLeft || 0)}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>
              {isLow ? '⚠ Running low!' : 'Time Left'}
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : '✓ Submit Test'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* MCQ Section */}
      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '1rem' }}>
        📋 Section A — Aptitude MCQs (10 Questions)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: 760 }}>
        {activeTest.questions.map((q, i) => (
          <div key={i} className="card" style={{ borderLeft: `3px solid ${answers[i] !== undefined ? 'var(--primary)' : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ background: answers[i] !== undefined ? 'var(--primary-light)' : 'var(--bg-glass)', color: answers[i] !== undefined ? 'var(--primary)' : 'var(--text-faint)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0, transition: 'all 0.25s' }}>{i + 1}</span>
              <p style={{ fontWeight: 500, lineHeight: 1.65, fontSize: '0.9rem' }}>{q.question}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {q.options.map((opt, j) => (
                <label key={j} style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.55rem 0.9rem', borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: answers[i] === j ? 'var(--primary-light)' : 'transparent',
                  border: `1.5px solid ${answers[i] === j ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                }}>
                  <input type="radio" name={`q${i}`} checked={answers[i] === j} onChange={() => setAnswers({ ...answers, [i]: j })} style={{ width: 'auto', accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coding Section */}
      {challenges.length > 0 && (
        <div style={{ maxWidth: 760, marginTop: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '1rem' }}>
            💻 Section B — Coding Challenges (2 Problems)
          </h3>
          {challenges.map((ch, i) => (
            <CodeEditor key={i} challenge={ch} idx={i} code={codes[i] || ch.starterCode} onChange={val => setCodes(c => ({ ...c, [i]: val }))} />
          ))}
        </div>
      )}
      <div style={{ height: '4rem' }} />
    </div>
  );

  /* ── Result View ── */
  if (result) return (
    <div className="animate-fade" style={{ maxWidth: 800 }}>
      <div className="flex-between mb-3">
        <h1 className="page-title" style={{ margin: 0 }}>Test Results</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost" onClick={async () => { const lb = await getTestLeaderboard(activeTest._id); setLeaderboard(lb); setShowLB(true); }}>
            🏆 Leaderboard
          </button>
          <button className="btn btn-ghost" onClick={() => { setActiveTest(null); setResult(null); }}>← Back</button>
        </div>
      </div>

      {/* Score card */}
      <div className="card mb-3" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: result.percentage >= 60 ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>{result.percentage}%</div>
        <div className="text-muted mt-1">{result.score} / {result.total} marks</div>
        <div style={{ fontSize: '1.2rem', marginTop: '0.6rem' }}>
          {result.percentage >= 80 ? '🎉 Excellent!' : result.percentage >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
        </div>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div><div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)' }}>#{result.rank}</div><div className="text-faint text-xs">Rank</div></div>
          <div><div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--secondary)' }}>{result.percentile}%ile</div><div className="text-faint text-xs">Percentile</div></div>
          <div><div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--warning)' }}>{Math.floor((result.timeTaken || 0) / 60)}m</div><div className="text-faint text-xs">Time Taken</div></div>
        </div>
      </div>

      {/* Leaderboard */}
      {showLB && leaderboard && (
        <div className="card mb-3">
          <h3 className="section-title">🏆 Top Performers</h3>
          {leaderboard.slice(0, 10).map((e, i) => (
            <div key={i} className="flex-between" style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, width: 24, color: i < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>#{e.rank}</span>
                <span style={{ fontSize: '0.875rem' }}>{e.user?.name || 'Anonymous'}</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{e.percentage}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Answer review */}
      <div className="card">
        <h3 className="section-title">Answer Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result.results?.map((r, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${r.correct ? 'var(--success)' : 'var(--danger)'}`, paddingLeft: '1rem' }}>
              <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.3rem' }}>{i + 1}. {r.question}</p>
              <p style={{ fontSize: '0.8rem', color: r.correct ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                {r.correct ? '✓ Correct' : `✗ Your: Option ${r.selected + 1} · Correct: Option ${r.correctAnswer + 1}`}
              </p>
              {r.explanation && <p className="text-muted text-sm mt-1">💡 {r.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Test List View ── */
  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         <div style={{ position: 'absolute', top: -50, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
         <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>
            📝 Assessment center
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Mock <span style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Test Engine</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>
            10 Aptitude MCQs + 2 Coding Challenges · Timed · Score tracked
          </p>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', ...DIFFICULTIES].map(d => {
          const ds = d ? DIFF_STYLE[d] : null;
          const active = diffTab === d;
          return (
            <button key={d} onClick={() => setDiffTab(d)}
              style={{
                padding: '0.55rem 1.35rem', borderRadius: 'var(--radius-full)', fontFamily: 'inherit',
                border: `1.5px solid ${active && ds ? ds.border : active ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                background: active ? (ds ? ds.bg : 'var(--primary-light)') : 'rgba(255,255,255,0.02)',
                color: active ? (ds ? ds.color : 'var(--primary)') : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: active ? 800 : 600, transition: 'all 0.2s', cursor: 'pointer',
                transform: active ? 'translateY(-1px)' : 'none',
                boxShadow: active ? `0 4px 14px ${ds ? ds.border : 'rgba(99,102,241,0.3)'}` : 'none',
              }}>
              {d || 'All Tests'}
            </button>
          );
        })}
      </div>

      {loading ? <Loader /> : (
        <div className="grid-3">
          {tests.map(test => {
            const ds = DIFF_STYLE[test.difficulty] || DIFF_STYLE.Medium;
            return (
              <div key={test._id} className="card card-hover" style={{
                display: 'flex', flexDirection: 'column', gap: '0.7rem',
                border: `1px solid rgba(255,255,255,0.05)`,
                background: 'linear-gradient(135deg, rgba(31,37,55,0.4) 0%, rgba(18,27,52,0.6) 100%)',
                position: 'relative', overflow: 'hidden', padding: '1.5rem',
              }}>
                {/* Difficulty accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${ds.color},transparent)` }} />
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${ds.color}20 0%, transparent 70%)` }} />

                <div className="flex-between mb-1">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{test.title}</h3>
                  <span style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.65rem' }}>
                    {test.difficulty || 'Medium'}
                  </span>
                </div>
                {test.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, flex: 1 }}>{test.description}</p>}

                {/* Meta info */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-faint)', flexWrap: 'wrap', marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>⏱ <strong style={{color:'var(--text)'}}>{test.duration}m</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📋 <strong style={{color:'var(--text)'}}>{test.questions?.length || 0}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>👥 <strong style={{color:'var(--text)'}}>{test.attempts?.length || 0}</strong></span>
                </div>

                <button className="btn btn-primary btn-full mt-2" onClick={() => startTest(test._id)}>
                  🚀 Start Assessment
                </button>
              </div>
            );
          })}
          {!tests.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>📝</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>No tests available for this filter</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Check back later or select a different difficulty</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockTests;
