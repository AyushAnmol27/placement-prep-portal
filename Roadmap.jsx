import { useEffect, useState } from 'react';
import { generateRoadmap, getRoadmap, updateWeek } from '../services/roadmapService';
import Loader from '../components/common/Loader';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Other'];

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ targetCompany: '', targetRole: '', currentLevel: 'Beginner' });

  useEffect(() => {
    getRoadmap()
      .then(setRoadmap)
      .catch(() => setRoadmap(null))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const r = await generateRoadmap(form);
      setRoadmap(r);
      setShowForm(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleWeek = async (weekNum, completed) => {
    try {
      const updated = await updateWeek(weekNum, { completed });
      setRoadmap(updated);
    } catch (err) {
      console.error('Failed to update week', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade" style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -50, left: '-10%', width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(132,85,239,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(132,85,239,0.1)', border: '1px solid rgba(132,85,239,0.25)',
              borderRadius: '999px', padding: '0.2rem 0.85rem', marginBottom: '0.65rem',
              fontSize: '0.75rem', color: 'var(--secondary-dark)', fontWeight: 600,
            }}>
              🗺 AI-Powered
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em', margin: 0,
            }}>
              Preparation{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Roadmap</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Your personalized, step-by-step study plan to crack the interview.
            </p>
          </div>
          <button className={`btn ${showForm ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : roadmap ? '🔄 Regenerate Plan' : '✨ Create Roadmap'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4 animate-slide" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--secondary), var(--primary), var(--tertiary))' }}/>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Generate Your Roadmap
          </h3>
          <form onSubmit={handleGenerate}>
            <div className="form-row">
              <div className="form-group">
                <label>Current Level</label>
                <select value={form.currentLevel} onChange={e => setForm({ ...form, currentLevel: e.target.value })} required>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Target Company (Optional)</label>
                <select value={form.targetCompany} onChange={e => setForm({ ...form, targetCompany: e.target.value })}>
                  <option value="">Any Company</option>
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Role (Optional)</label>
                <input value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })} placeholder="e.g. Frontend Developer, SDE" />
              </div>
              <div className="form-group">
                <label>Target Date (Optional)</label>
                <input type="date" value={form.targetDate || ''} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
               <button className="btn btn-primary" type="submit" disabled={generating}>
                {generating ? <><span className="spinner spinner-sm" /> <span>Consulting AI...</span></> : '✨ Generate Roadmap'}
              </button>
            </div>
          </form>
        </div>
      )}

      {roadmap ? (
        <div className="animate-fade">
          {/* Overview Card */}
          <div className="card mb-4" style={{
            background: 'linear-gradient(135deg, rgba(31,37,55,0.7) 0%, rgba(18,27,52,0.9) 100%)',
            border: '1px solid rgba(132,85,239,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -100, right: -50, width: 250, height: 250, background: 'radial-gradient(circle, rgba(132,85,239,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                   {roadmap.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {roadmap.targetCompany && <span className="tag">🏢 {roadmap.targetCompany}</span>}
                  {roadmap.targetRole && <span className="tag">💼 {roadmap.targetRole}</span>}
                  <span className="tag">📈 {roadmap.currentLevel}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', background: 'var(--surface-container)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1 }}>{roadmap.progress || 0}%</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', fontWeight: 700, marginTop: '0.2rem' }}>Completed</div>
              </div>
            </div>
            <div className="progress-bar mt-2" style={{ height: 8, background: 'var(--surface-container)' }}>
              <div className="progress-fill" style={{ width: `${roadmap.progress || 0}%`, background: 'linear-gradient(90deg, var(--secondary), var(--success))' }} />
            </div>
          </div>

          {/* Timeline / Weeks */}
          <div style={{ position: 'relative' }}>
            {/* Vertical connector line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 24, width: 2,
              background: 'linear-gradient(to bottom, var(--primary) 0%, rgba(99,102,241,0.2) 100%)',
              opacity: 0.5, zIndex: 0,
            }} className="hide-mobile" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              {roadmap.weeks?.map((week, idx) => {
                const isCompleted = week.completed;
                return (
                  <div key={week.week || idx} className="card card-hover" style={{
                    padding: '1.5rem',
                    background: isCompleted ? 'rgba(31,37,55,0.4)' : 'var(--bg-card)',
                    borderLeft: `4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}`,
                    opacity: isCompleted ? 0.8 : 1,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    marginLeft: '3rem', /* space for connector */
                  }}>
                    {/* Floating node for desktop timeline */}
                    <div className="hide-mobile" style={{
                      position: 'absolute', top: '1.5rem', left: '-3rem', width: 44, height: 44,
                      transform: 'translateX(-50%)',
                      background: isCompleted ? 'var(--success-bg)' : 'var(--bg-card)',
                      border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}`,
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 800, color: isCompleted ? 'var(--success)' : 'var(--primary)',
                      boxShadow: isCompleted ? '0 0 12px rgba(74,222,128,0.4)' : '0 0 12px rgba(99,102,241,0.3)',
                    }}>
                      {isCompleted ? '✓' : week.week}
                    </div>

                    <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="hide-desktop" style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: isCompleted ? 'var(--success-bg)' : 'var(--primary-light)',
                          border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 700,
                          color: isCompleted ? 'var(--success)' : 'var(--primary)',
                        }}>
                          {isCompleted ? '✓' : week.week}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: isCompleted ? 'var(--text-muted)' : 'var(--text)' }}>
                          {week.title}
                        </h3>
                      </div>
                      <button
                        className={`btn btn-sm ${isCompleted ? 'btn-ghost' : 'btn-primary'}`}
                        onClick={() => handleToggleWeek(week.week, !isCompleted)}
                        style={{ background: isCompleted ? '' : 'linear-gradient(135deg, var(--success), #10b981)', border: isCompleted ? '' : 'none', color: isCompleted ? '' : '#fff' }}
                      >
                         {isCompleted ? '↩ Undo' : '✓ Mark Complete'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                      
                      {/* Topics */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <span>🎯</span> Topics
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                           {week.topics?.map(t => <span key={t} className="tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>{t}</span>)}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <span>📚</span> Resources
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {week.resources?.map(r => (
                            <li key={r} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                              <span style={{ color: 'var(--primary)' }}>•</span> <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practice */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <span>⌨️</span> Practice Goals
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {week.problems?.map(p => (
                            <li key={p} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                              <span style={{ color: 'var(--success)' }}>•</span> <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        !showForm && (
          <div className="card flex-center animate-fade" style={{ flexDirection: 'column', gap: '1rem', padding: '5rem 2rem', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(132,85,239,0.3)', background: 'transparent', boxShadow: 'none' }}>
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(132,85,239,0.4))', animation: 'float 4s ease-in-out infinite' }}>🗺️</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>No Roadmap Found</h2>
            <p className="text-muted" style={{ maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>Generate a personalized, AI-driven preparation plan tailored to your current level and target company.</p>
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }} onClick={() => setShowForm(true)}>
              ✨ Generate My Roadmap
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Roadmap;
