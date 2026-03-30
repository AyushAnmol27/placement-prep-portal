import { useEffect, useState, useCallback, useRef } from 'react';
import { getQuestions } from '../services/aptitudeService';
import AptitudeQuestion from '../components/aptitude/AptitudeQuestion';
import Loader from '../components/common/Loader';

/* ── Static Rich Data ──────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'Quantitative',
    label: 'Quantitative',
    icon: '🔢',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))',
    border: 'rgba(99,102,241,0.3)',
    desc: 'Numbers, percentages, speed, time & more',
    concepts: [
      { title: 'Percentages', icon: '%', desc: 'Convert between fractions, percentages & decimals. Master % increase/decrease formulas.' },
      { title: 'Profit & Loss', icon: '💰', desc: 'Cost price, selling price, marked price discount chains and successive discounts.' },
      { title: 'Time & Work', icon: '⚙️', desc: 'LCM method for combined work. Pipes & cisterns as special case.' },
      { title: 'Speed, Distance & Time', icon: '🚀', desc: 'Relative speed, average speed (harmonic mean for equal distances).' },
      { title: 'Number System', icon: '🔢', desc: 'Divisibility rules, HCF/LCM, remainders, cyclicity of units digit.' },
      { title: 'Simple & Compound Interest', icon: '📈', desc: 'SI = PNR/100. CI uses (1+R/100)^N. Half-yearly & quarterly compounding.' },
    ],
    formulas: [
      { name: 'Profit %', formula: '((SP - CP) / CP) × 100' },
      { name: 'Discount %', formula: '((MP - SP) / MP) × 100' },
      { name: 'SI', formula: '(P × R × T) / 100' },
      { name: 'CI', formula: 'P × (1 + R/100)^T − P' },
      { name: 'Distance', formula: 'Speed × Time' },
      { name: 'Work Rate', formula: '1/A + 1/B = 1/T' },
      { name: 'Avg Speed (equal dist)', formula: '2UV / (U + V)' },
      { name: 'Time & Work LCM', formula: 'Total work = LCM(man-days)' },
    ],
  },
  {
    id: 'Logical',
    label: 'Logical Reasoning',
    icon: '🧩',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg,rgba(6,182,212,0.2),rgba(99,102,241,0.1))',
    border: 'rgba(6,182,212,0.3)',
    desc: 'Sequences, analogies, syllogisms & more',
    concepts: [
      { title: 'Series Completion', icon: '📊', desc: 'Number series (arithmetic, geometric, Fibonacci). Letter & symbolic series.' },
      { title: 'Analogies', icon: '🔗', desc: 'Word, number and letter analogies. Find missing relationship.' },
      { title: 'Syllogisms', icon: '📐', desc: 'Venn diagram approach. All/Some/No statement conclusions.' },
      { title: 'Coding-Decoding', icon: '🔐', desc: 'Letter shift / reverse / pattern coding. Number coding.' },
      { title: 'Blood Relations', icon: '👨‍👩‍👧', desc: 'Draw family trees. Male/Female qualifiers. Puzzles with multiple clues.' },
      { title: 'Seating Arrangements', icon: '💺', desc: 'Circular vs linear. Facing in/out. Constraint satisfaction.' },
    ],
    formulas: [
      { name: 'Arithmetic Series nth', formula: 'a + (n-1)d' },
      { name: 'Geometric Series nth', formula: 'a × r^(n-1)' },
      { name: 'Fibonacci', formula: 'F(n) = F(n-1) + F(n-2)' },
      { name: 'Circular Arrangements', formula: '(n-1)!' },
      { name: 'Linear Arrangements', formula: 'n!' },
      { name: 'Combinations', formula: 'C(n,r) = n! / (r!(n-r)!)' },
      { name: 'Permutations', formula: 'P(n,r) = n! / (n-r)!' },
      { name: 'Venn (A∪B)', formula: '|A| + |B| − |A∩B|' },
    ],
  },
  {
    id: 'Verbal',
    label: 'Verbal Ability',
    icon: '📝',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(139,92,246,0.1))',
    border: 'rgba(236,72,153,0.3)',
    desc: 'Grammar, vocabulary, RC & verbal reasoning',
    concepts: [
      { title: 'Reading Comprehension', icon: '📖', desc: 'Main idea, inference, tone/attitude. Para-jumbles. Speed reading techniques.' },
      { title: 'Sentence Correction', icon: '✏️', desc: 'Subject-verb agreement, tense consistency, parallelism, modifiers.' },
      { title: 'Vocabulary', icon: '🔤', desc: 'Synonyms, antonyms, one-word substitutions. Idioms and phrases.' },
      { title: 'Para Jumbles', icon: '🔀', desc: 'Find the opener (topic sentence). Link pairs using pronouns, connectors.' },
      { title: 'Critical Reasoning', icon: '🧠', desc: 'Strengthen/weaken arguments, assumptions, conclusions, paradox resolution.' },
      { title: 'Fill in the Blanks', icon: '🔲', desc: 'Contextual word choice. Prepositions, articles, conjunctions.' },
    ],
    formulas: [
      { name: 'Analogy Types', formula: 'Synonym / Antonym / Part-Whole / Function' },
      { name: 'Sentence Types', formula: 'Simple / Compound / Complex / Compound-Complex' },
      { name: 'Para-jumble Strategy', formula: 'Opener → Middle links → Conclusion' },
      { name: 'RC Tone', formula: 'Positive / Negative / Neutral / Critical' },
      { name: 'Root Words', formula: 'Prefix + Root + Suffix = Meaning' },
      { name: 'Error Pattern', formula: 'S-V Agree / Tense / Pronoun / Modifier' },
      { name: 'Inference vs Fact', formula: '"Must be true" vs "Could be true"' },
      { name: 'Assumption Rule', formula: 'Negation test — if negated, conclusion fails' },
    ],
  },
];

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'];

/* ── Sub-components ─────────────────────────────────────────────────── */

const ConceptCard = ({ item, color, gradient, border }) => (
  <div
    style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem',
      cursor: 'default',
    }}
  >
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <span style={{
        fontSize: '1.4rem', lineHeight: 1,
        background: gradient, borderRadius: 'var(--radius)',
        padding: '0.4rem', display: 'inline-block',
      }}>{item.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
          {item.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
          {item.desc}
        </div>
      </div>
    </div>
  </div>
);

const FormulaSheet = ({ formulas, color, gradient, border }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: `1px solid var(--border)`,
    borderRadius: 'var(--radius-lg)',
    padding: '1.35rem',
    backdropFilter: 'blur(20px)',
  }}>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <span>📋</span> Formula Cheat Sheet
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {formulas.map((f, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{f.name}</span>
          <code style={{
            fontSize: '0.78rem', background: gradient,
            border: `1px solid ${border}`, color,
            padding: '0.15rem 0.55rem', borderRadius: '6px',
            fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap',
          }}>{f.formula}</code>
        </div>
      ))}
    </div>
  </div>
);

const QuestionCard = ({ question, idx, onSelect }) => (
  <div
    onClick={() => onSelect(question)}
    style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.2rem',
      cursor: 'pointer',
      position: 'relative', overflow: 'hidden',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
      <span style={{
        background: 'var(--primary-light)', color: 'var(--primary)',
        borderRadius: '50%', width: 26, height: 26, minWidth: 26,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 800,
      }}>{idx + 1}</span>
      <span className={`badge badge-${question.difficulty?.toLowerCase()}`}>{question.difficulty}</span>
    </div>
    <p style={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.55, color: 'var(--text)', marginBottom: '0.6rem' }}>
      {question.question?.slice(0, 120)}{question.question?.length > 120 ? '…' : ''}
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{question.category}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {`${question.options?.length} options`}
      </span>
    </div>
  </div>
);

/* ── Main Page ──────────────────────────────────────────────────────── */
const Aptitude = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeTab, setActiveTab] = useState('concepts'); // concepts | formulas | practice
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ difficulty: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const tabsRef = useRef(null);

  const cat = CATEGORIES[activeCategory];

  /* Fetch questions when switching to practice tab or changing filters */
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { category: cat.id, limit: 12, page: filters.page };
      if (filters.difficulty) params.difficulty = filters.difficulty;
      const data = await getQuestions(params);
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [cat.id, filters]);

  useEffect(() => {
    if (activeTab === 'practice') fetchQuestions();
  }, [activeTab, fetchQuestions]);

  const handleCategoryChange = (idx) => {
    setActiveCategory(idx);
    setFilters({ difficulty: '', page: 1 });
    setQuestions([]);
    setActiveQuestion(null);
    // reset to concepts tab when switching category
    if (activeTab === 'practice') setActiveTab('concepts');
  };

  const handleCorrect = (id) => {
    if (!solvedIds.has(id)) {
      setSolvedIds(prev => new Set([...prev, id]));
      setSessionScore(s => s + 1);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* ── Header ── */}
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         <div style={{ position: 'absolute', top: -50, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
         <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
            🧠 Logical Reasoning
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Aptitude <span style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Practice Hub</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Master concepts · Memorize formulas · Ace quizzes</p>
        </div>
        <div style={{
          display: 'flex', gap: '1.25rem', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(31,37,55,0.7) 0%, rgba(18,27,52,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-lg)', padding: '0.85rem 1.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1 }}>{sessionScore}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginTop: '0.2rem' }}>Solved</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginTop: '0.2rem' }}>Total Qs</div>
          </div>
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => handleCategoryChange(i)}
            style={{
              padding: '0.65rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${i === activeCategory ? c.border : 'rgba(255,255,255,0.05)'}`,
              background: i === activeCategory ? c.gradient : 'var(--bg-card)',
              color: i === activeCategory ? c.color : 'var(--text-muted)',
              fontWeight: i === activeCategory ? 800 : 600, fontSize: '0.9rem',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              transform: i === activeCategory ? 'translateY(-2px)' : 'none',
              boxShadow: i === activeCategory ? `0 8px 24px rgba(0,0,0,0.3), inset 0 0 0 1px ${c.border}` : 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* ── Category Hero Banner ── */}
      <div className="card animate-slide" style={{
        background: `linear-gradient(135deg, rgba(31,37,55,0.8) 0%, rgba(18,27,52,0.95) 100%)`,
        border: `1px solid ${cat.border}`,
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -50, width: 250, height: 250, background: `radial-gradient(circle, ${cat.color}30 0%, transparent 60%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{
          width: 80, height: 80, borderRadius: '1.5rem', background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}40)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: `1px solid ${cat.color}50`
        }}>
          {cat.icon}
        </div>
        
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontWeight: 900, fontSize: '1.6rem', color: '#fff', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>{cat.label}</h2>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.95rem', margin: 0 }}>{cat.desc}</p>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexShrink: 0, zIndex: 1 }}>
          <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: cat.color }}>{cat.concepts.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Concepts</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: cat.color }}>{cat.formulas.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Formulas</div>
          </div>
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div ref={tabsRef} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'concepts', label: '💡 Concepts', },
          { id: 'formulas', label: '📋 Cheat Sheet', },
          { id: 'practice', label: '🎯 Practice', },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontFamily: 'inherit',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              fontWeight: activeTab === t.id ? 800 : 600,
              color: activeTab === t.id ? 'var(--primary)' : 'var(--text-faint)',
              borderBottom: activeTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              if (activeTab !== t.id) e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseOut={e => {
              if (activeTab !== t.id) e.currentTarget.style.color = 'var(--text-faint)';
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Active Question Modal ── */}
      {activeQuestion && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,8,15,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ width: '100%', maxWidth: 680, animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🤓</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Practice Question</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveQuestion(null)} style={{ fontSize: '1.2rem', padding: '0.2rem 0.6rem' }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem 1.75rem' }}>
              <AptitudeQuestion
                question={activeQuestion}
                onClose={() => setActiveQuestion(null)}
                onCorrect={() => handleCorrect(activeQuestion._id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Concepts ── */}
      {activeTab === 'concepts' && (
        <div className="animate-fade">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.25rem' }}>
            {cat.concepts.map((item, i) => (
              <ConceptCard key={i} item={item} color={cat.color} gradient={cat.gradient} border={cat.border} />
            ))}
          </div>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('practice')}
              style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}
            >
              🎯 Start Practicing →
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Formulas ── */}
      {activeTab === 'formulas' && (
        <div className="animate-fade">
          <FormulaSheet formulas={cat.formulas} color={cat.color} gradient={cat.gradient} border={cat.border} />
          <div style={{
            marginTop: '1.5rem', padding: '1.25rem 1.5rem',
            background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', color: 'var(--warning)',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <span style={{ fontWeight: 600, lineHeight: 1.5 }}>Pro Tip: Memorize formulas by solving 3 problems for each. Practice beats passive reading every time!</span>
          </div>
        </div>
      )}

      {/* ── Tab: Practice ── */}
      {activeTab === 'practice' && (
        <div className="animate-fade">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</span>
              <select
                value={filters.difficulty}
                onChange={e => setFilters({ difficulty: e.target.value, page: 1 })}
                style={{ width: 'auto', minWidth: 160, background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.8rem' }}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All Difficulties'}</option>)}
              </select>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 600 }}>
              Showing {questions.length} of {total} questions
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              {questions.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.25rem' }}>
                  {questions.map((q, i) => (
                    <QuestionCard
                      key={q._id}
                      question={q}
                      idx={(filters.page - 1) * 12 + i}
                      onSelect={setActiveQuestion}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🔍</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>No questions found</div>
                  <div style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Try changing the difficulty filter or check back later</div>
                </div>
              )}

              {/* Pagination */}
              {total > 12 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-ghost"
                    disabled={filters.page === 1}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    style={{ padding: '0.6rem 1.25rem' }}
                  >← Previous</button>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-card)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}>
                    Page {filters.page} of {Math.ceil(total / 12) || 1}
                  </span>
                  <button
                    className="btn btn-ghost"
                    disabled={filters.page * 12 >= total}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    style={{ padding: '0.6rem 1.25rem' }}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Aptitude;
