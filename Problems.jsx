import { useEffect, useState, useCallback } from 'react';
import { getProblems, createProblem } from '../services/problemService';
import { getProfile } from '../services/authService';
import ProblemCard from '../components/problems/ProblemCard';
import Loader from '../components/common/Loader';

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'];

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ difficulty: '', search: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
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

  const handleSolved = (id, result) => {
    setSolvedIds(prev => new Set([...prev, id]));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProblem({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setShowForm(false);
    setForm({ title: '', description: '', difficulty: 'Easy', tags: '', link: '', platform: 'LeetCode' });
    fetchProblems();
  };

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         <div style={{ position: 'absolute', top: -100, left: 100, width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}/>
         <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.75rem' }}>
            💻 Coding Challenges
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Practice <span style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Problems</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Solve coding challenges from top platforms to sharpen your skills.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          {showForm ? '✕ Cancel' : '+ Add Problem'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-slide mb-4" style={{ background: 'linear-gradient(135deg, rgba(31,37,55,0.7) 0%, rgba(18,27,52,0.9) 100%)', border: '1px solid #10b981', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📝</span> Add New Problem
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Two Sum" required style={{ background: 'rgba(0,0,0,0.2)', fontSize: '1.05rem', padding: '0.8rem 1rem' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the problem..." required style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ background: 'rgba(0,0,0,0.2)' }}>
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={{ background: 'rgba(0,0,0,0.2)' }}>
                {['LeetCode', 'HackerRank', 'CodeForces', 'Other'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="array, dp, graph" style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Link</label>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" type="submit" style={{ padding: '0.8rem 2.5rem' }}>Add Problem</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search problems by title or keyword..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          />
        </div>
        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value, page: 1 })}
          style={{ width: 'auto', background: 'var(--bg-card)', padding: '0.6rem 2.5rem 0.6rem 1rem' }}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d || 'All Difficulties'}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid-2">
            {problems.map(p => (
              <ProblemCard key={p._id} problem={p} isSolved={solvedIds.has(p._id)} onSolved={handleSolved} />
            ))}
          </div>
          {!problems.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', marginTop: '1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>💻</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>No problems found</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Adjust your filters and try again!</div>
            </div>
          )}
          
          {total > 12 && (
             <div className="flex-center gap-2 mt-4" style={{ padding: '1.5rem 0' }}>
               <button className="btn btn-ghost" disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} style={{ padding: '0.6rem 1.25rem' }}>← Previous</button>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-card)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}>Page {filters.page} of {Math.ceil(total / 12) || 1}</span>
               <button className="btn btn-ghost" disabled={filters.page * 12 >= total} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} style={{ padding: '0.6rem 1.25rem' }}>Next →</button>
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default Problems;
