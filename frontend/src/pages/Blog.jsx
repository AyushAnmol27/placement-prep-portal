import { useEffect, useState } from 'react';
import { getBlogs, getBlog, createBlog, toggleLike } from '../services/blogService';
import useAuth from '../hooks/useAuth';
import { timeAgo } from '../utils/dateUtils';
import Loader from '../components/common/Loader';

const CATEGORIES = ['', 'DSA', 'System Design', 'Interview Experience', 'Tips & Tricks', 'General'];

const Blog = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'General', tags: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    setLoading(true);
    getBlogs(params).then(d => setBlogs(d.blogs)).finally(() => setLoading(false));
  }, [category, search]);

  const handleOpen = async (id) => {
    const blog = await getBlog(id);
    setActive(blog);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const created = await createBlog(data);
      setBlogs([created, ...blogs]);
      setShowForm(false);
      setForm({ title: '', content: '', excerpt: '', category: 'General', tags: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async (id) => {
    const res = await toggleLike(id);
    if (active?._id === id) setActive(prev => ({ ...prev, likes: Array(res.likes).fill(null) }));
    setBlogs(prev => prev.map(b => b._id === id ? { ...b, likes: Array(res.likes).fill(null) } : b));
  };

  if (active) return (
    <div className="animate-fade" style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="flex-between mb-4">
        <button className="btn btn-ghost" onClick={() => setActive(null)} style={{ padding: '0.6rem 1.25rem' }}>
          ← Back to Articles
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => handleLike(active._id)} style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))', border: '1px solid rgba(236,72,153,0.3)', color: '#f472b6' }}>
            ❤️ {active.likes?.length || 0} Likes
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>{active.category}</span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {active.title}
        </h1>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
              {active.author?.name?.charAt(0) || 'A'}
            </div>
            {active.author?.name || 'Anonymous'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span>📅</span> {new Date(active.createdAt).toLocaleDateString()}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span>👁️</span> {active.views} views</span>
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem 3rem', background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ lineHeight: 1.9, fontSize: '1.05rem', color: 'var(--text)', whiteSpace: 'pre-wrap', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {active.content}
        </div>
        
        {active.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', alignSelf: 'center', marginRight: '0.5rem' }}>TAGS:</span>
            {active.tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>#{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         <div style={{ position: 'absolute', top: -100, left: 100, width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}/>
         <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
            📚 Community Insights
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Developer <span style={{ background: 'linear-gradient(135deg, var(--secondary), var(--tertiary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Blog</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Discover insights, interview experiences, and study guides.</p>
        </div>
        
        {user && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ padding: '0.8rem 1.5rem' }}>
            {showForm ? '✕ Cancel' : '✍️ Write Article'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card animate-slide mb-4" style={{ border: '1px solid var(--primary)', background: 'linear-gradient(135deg, rgba(31,37,55,0.7) 0%, rgba(18,27,52,0.9) 100%)', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Compose New Post</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter a descriptive title..." required style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Excerpt (short summary)</label>
              <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary to hook readers..." style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content</label>
              <textarea rows={12} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your article here... (Markdown supported visually)" required style={{ background: 'rgba(0,0,0,0.2)', fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', lineHeight: 1.7 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 2fr)', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. dsa, tips, career" style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} type="submit" disabled={saving} style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>
                {saving ? 'Publishing...' : '🚀 Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input placeholder="Search articles by title or keyword..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto', background: 'var(--bg-card)', padding: '0.6rem 2.5rem 0.6rem 1rem' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="grid-3">
          {blogs.map((b, i) => (
            <div key={b._id} className="card card-hover" style={{
              display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: 0, overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(31,37,55,0.4) 0%, rgba(18,27,52,0.6) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              animation: `slideUp 0.4s ease ${i * 0.05}s backwards`,
            }} onClick={() => handleOpen(b._id)}>
              
              {/* Graphic Header */}
              <div style={{ height: '120px', background: `linear-gradient(135deg, ${b.category === 'DSA' ? '#ec4899' : b.category === 'System Design' ? '#0ea5e9' : '#8b5cf6'}40, transparent)`, position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <span className="badge" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{b.category}</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                     ❤️ {b.likes?.length || 0}
                   </div>
                 </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                   <span>📅</span> {new Date(b.createdAt).toLocaleDateString()}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.4, margin: '0 0 0.75rem 0', color: 'var(--text)' }}>{b.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, flex: 1, margin: 0 }}>
                  {b.excerpt || b.content.substring(0, 100) + '...'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                     {b.author?.name?.charAt(0) || 'A'}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{b.author?.name || 'Anonymous User'}</span>
                </div>
              </div>
            </div>
          ))}
          {!blogs.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>📰</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>No articles found</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Be the first to write an article in this category!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
