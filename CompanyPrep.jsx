import { useState, useEffect, useRef, useCallback } from 'react';
import { COMPANIES, DIFFICULTY_COLORS } from '../data/companyData';
import CompanyCard from '../components/company/CompanyCard';

// ── Company Detail View ─────────────────────────────────────────────
const CompanyDetail = ({ company, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const diff = DIFFICULTY_COLORS[company.difficulty] || DIFFICULTY_COLORS.Medium;

  const tabs = [
    { id: 'overview', label: '🏢 Overview' },
    { id: 'process', label: '🔄 Interview Process' },
    { id: 'questions', label: '❓ Top 20 Questions' },
    { id: 'pattern', label: '📊 Recent Pattern' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: company.colorGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', flexShrink: 0,
          }}>{company.emoji}</div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: company.colorPrimary }}>{company.name}</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', margin: 0 }}>🏢 {company.industry} · {company.hq}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.4rem 0.85rem' }}>
            <div style={{ fontWeight: 800, color: company.colorPrimary }}>{company.avgPackage}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase' }}>Avg Package</div>
          </div>
          <span style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}`, borderRadius: '999px', padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.8rem' }}>
            {company.difficulty}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            style={{ background: 'none', border: 'none', fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>About</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>{company.description}</p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div><div style={{ fontWeight: 700 }}>{company.founded}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Founded</div></div>
              <div><div style={{ fontWeight: 700 }}>{company.employeeCount}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Employees</div></div>
              <div><div style={{ fontWeight: 700 }}>{company.hq}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>HQ</div></div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Tech Stack</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {company.techStack?.map(t => (
                <span key={t} style={{ background: `${company.colorPrimary}18`, color: company.colorPrimary, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.7rem' }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Tags & Roles</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {company.tags?.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Interview Process ── */}
      {activeTab === 'process' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card" style={{ marginBottom: '1rem', background: `${company.colorPrimary}10`, border: `1px solid ${company.colorPrimary}33` }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, marginBottom: '0.6rem', textTransform: 'uppercase' }}>Overview</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>{company.interviewProcess}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {company.rounds?.map((r, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: company.colorGrad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 900, color: '#fff',
                }}>R{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Questions ── */}
      {activeTab === 'questions' && (
        <div style={{ animation: 'fadeIn 0.3s ease', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              🧠 Behavioral Questions (10)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {company.behavioralQuestions?.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', borderRadius: '50%', width: 22, height: 22, minWidth: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{i + 1}</span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              💻 Technical Questions (10)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {company.technicalQuestions?.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <span style={{ background: `${company.colorPrimary}20`, color: company.colorPrimary, borderRadius: '50%', width: 22, height: 22, minWidth: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{i + 1}</span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Recent Pattern ── */}
      {activeTab === 'pattern' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card" style={{ background: `${company.colorPrimary}10`, border: `1px solid ${company.colorPrimary}33` }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: company.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>📊 2024 Interview Pattern</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{company.recentPattern}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────
const CompanyPrep = () => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selected, setSelected] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef(null);

  // Filter logic
  const filtered = COMPANIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = !difficulty || c.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  const visible = filtered.slice(0, visibleCount);

  // Intersection Observer for lazy loading
  const loadMore = useCallback(() => {
    setVisibleCount(v => Math.min(v + 6, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    setVisibleCount(6);
  }, [search, difficulty]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  if (selected) return <CompanyDetail company={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title" style={{ margin: 0, marginBottom: '0.3rem' }}>
          Company <span className="text-gradient">Prep Hub</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Detailed profiles · Interview patterns · Top 20 questions per company
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Companies', value: COMPANIES.length, icon: '🏢', color: '#6366f1' },
          { label: 'Interview Qs', value: COMPANIES.length * 20, icon: '❓', color: '#06b6d4' },
          { label: 'Difficulty Levels', value: 3, icon: '📊', color: '#f59e0b' },
          { label: 'Industries', value: 7, icon: '🌐', color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', flex: '1 1 150px' }}>
            <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Search companies, tags, industries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320, flex: '1 1 200px' }}
        />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['', 'Easy', 'Medium', 'Hard'].map(d => {
            const dc = d ? DIFFICULTY_COLORS[d] : null;
            const active = difficulty === d;
            return (
              <button key={d} onClick={() => setDifficulty(d)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '999px', border: `1.5px solid ${active && dc ? dc.border : 'var(--border)'}`,
                  background: active && dc ? dc.bg : 'var(--bg-card)', color: active && dc ? dc.text : 'var(--text-muted)',
                  fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {d || 'All'}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>
          {filtered.length} companies
        </span>
      </div>

      {/* Company Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.1rem' }}>
        {visible.map((c, i) => (
          <div key={c.id} style={{ animation: `fadeIn 0.4s ease ${(i % 6) * 0.07}s both` }}>
            <CompanyCard company={c} onClick={setSelected} style={{ height: '100%' }} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!filtered.length && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div style={{ fontWeight: 600 }}>No companies found</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try a different search or filter</div>
        </div>
      )}

      {/* Intersection observer target (lazy load trigger) */}
      {visibleCount < filtered.length && (
        <div ref={loaderRef} style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;
