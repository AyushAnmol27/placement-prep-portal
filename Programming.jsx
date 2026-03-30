import { useEffect, useState, useCallback } from 'react';
import { getProblems, createProblem } from '../services/problemService';
import { getProfile } from '../services/authService';
import ProblemCard from '../components/programming/ProblemCard';
import CodeEditor from '../components/programming/CodeEditor';
import Loader from '../components/common/Loader';

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'];

const Programming = () => {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ difficulty: '', search: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Easy', tags: '', link: '', platform: 'LeetCode' });

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 12 };
      if (!params.difficulty) delete params.difficulty;
      if (!params.search) delete params.search;
      const data = await getProblems(params);
      setProblems(data.problems);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);
  useEffect(() => {
    getProfile().then(p => setSolvedIds(new Set(p.solvedProblems?.map(s => s._id || s))));
  }, []);

  const handleSolved = (id) => setSolvedIds(prev => new Set([...prev, id]));

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProblem({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setShowForm(false);
    setForm({ title: '', description: '', difficulty: 'Easy', tags: '', link: '', platform: 'LeetCode' });
    fetchProblems();
  };

  if (activeProblem) return (
    <div className="animate-fade">
      <div className="flex-between mb-3" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <button className="btn btn-icon btn-ghost" onClick={() => setActiveProblem(null)}>
              ←
            </button>
            <h1 className="page-title" style={{ margin: 0 }}>{activeProblem.title}</h1>
          </div>
          <span className={`badge badge-${activeProblem.difficulty?.toLowerCase()}`} style={{ marginLeft: '2.5rem' }}>
            {activeProblem.difficulty}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div className="card" style={{ height: '100%', borderTop: `2px solid var(--${activeProblem.difficulty.toLowerCase()})` }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               📖 Problem Description
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{activeProblem.description}</p>
            {activeProblem.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem' }}>
                {activeProblem.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
            {activeProblem.link && (
              <div style={{ marginTop: '2rem' }}>
                <a href={activeProblem.link} target="_blank" rel="noreferrer"
                  className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>
                  Solve on {activeProblem.platform} ↗
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <CodeEditor problemId={activeProblem._id} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 className="page-title" style={{ margin: 0, marginBottom: '0.3rem' }}>
            Code <span className="text-gradient">Arena</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Master algorithms, practice coding, and ace your interviews.
          </p>
        </div>
        <button className={`btn ${showForm ? 'btn-ghost' : 'btn-primary'}`} style={{ background: showForm ? '' : 'linear-gradient(135deg, #10b981, #059669)', boxShadow: showForm ? '' : '0 4px 15px rgba(16, 185, 129, 0.4)' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Problem'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 animate-slide">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>✨ Add New Problem</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Description</label>
              <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Platform</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                {['LeetCode', 'HackerRank', 'CodeForces', 'Other'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="array, dp, graph" />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" type="submit">Submit Problem</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
          <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input placeholder="Search problems..." value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            style={{ paddingLeft: '2.4rem' }} />
        </div>
        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value, page: 1 })} style={{ width: 'auto', flexShrink: 0 }}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All Difficulties'}</option>)}
        </select>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>
          {total} total problems
        </span>
      </div>

      {/* Grid */}
      {loading ? <Loader /> : (
        <>
          <div className="grid-2">
            {problems.map(p => (
              <ProblemCard key={p._id} problem={p} isSolved={solvedIds.has(p._id)}
                onSolved={handleSolved} onOpenEditor={setActiveProblem} />
            ))}
          </div>
          {!problems.length && (
            <div className="card flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem', textAlign: 'center', gridColumn: '1/-1', background: 'transparent', border: 'none' }}>
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <p className="text-muted" style={{ fontWeight: 600 }}>No problems found.</p>
            </div>
          )}
          <div className="flex-center gap-2 mt-4 mb-2">
            <button className="btn btn-ghost btn-sm" disabled={filters.page === 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
             <div style={{ background: 'var(--bg-card)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
               Page {filters.page} of {Math.ceil(total / 12) || 1}
             </div>
            <button className="btn btn-ghost btn-sm" disabled={filters.page * 12 >= total}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Programming;
