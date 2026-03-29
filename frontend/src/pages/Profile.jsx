import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/authService';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

/* ── Stat Row ── */
const StatRow = ({ label, value, color = 'var(--primary)', icon }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.6rem 0', borderBottom: '1px solid rgba(68,71,86,0.2)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
      <span>{icon}</span>{label}
    </div>
    <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{value}</span>
  </div>
);

/* ── Difficulty Pill ── */
const DiffPill = ({ diff, count }) => {
  const cfg = {
    Easy:   { color: 'var(--easy)',    bg: 'var(--success-bg)' },
    Medium: { color: 'var(--medium)',  bg: 'var(--warning-bg)' },
    Hard:   { color: 'var(--hard)',    bg: 'var(--danger-bg)'  },
  }[diff] || {};
  return (
    <div style={{
      background: cfg.bg, borderRadius: 'var(--radius)', padding: '1rem',
      textAlign: 'center', flex: 1,
    }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: cfg.color }}>{count}</div>
      <div style={{ fontSize: '0.72rem', color: cfg.color, fontWeight: 700, marginTop: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{diff}</div>
    </div>
  );
};

/* ── Main ── */
const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]   = useState('');

  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      setForm({
        name: p.name, bio: p.bio, college: p.college,
        graduationYear: p.graduationYear,
        skills: p.skills?.join(', ') || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setProfile(prev => ({ ...prev, ...updated }));
      updateUser(updated);
      setEditing(false);
      setMsg('✅ Profile updated successfully!');
      setTimeout(() => setMsg(''), 3500);
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  const solved  = profile?.solvedProblems || [];
  const easy    = solved.filter(p => p.difficulty === 'Easy').length;
  const medium  = solved.filter(p => p.difficulty === 'Medium').length;
  const hard    = solved.filter(p => p.difficulty === 'Hard').length;
  const xpInLvl = (profile?.xp || 0) % 500;
  const xpPct   = Math.round((xpInLvl / 500) * 100);

  /* gradient for avatar — deterministic from name */
  const GRADS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#06b6d4,#6366f1)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
    'linear-gradient(135deg,#22c55e,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
  ];
  const grad = GRADS[(profile?.name?.charCodeAt(0) || 0) % GRADS.length];

  return (
    <div className="animate-fade" style={{ maxWidth: 980 }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '-0.03em', margin: 0,
        }}>
          My{' '}
          <span style={{
            background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Profile</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
          Manage your account, view progress and earned badges
        </p>
      </div>

      {/* ── Flash message ── */}
      {msg && (
        <div className="alert alert-success mb-3" style={{ animation: 'slideUp 0.3s ease' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>

        {/* ════════════════════════════════
            LEFT PANEL
            ════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ── Avatar card ── */}
          <div className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'visible' }}>
            {/* Top glow bar */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
            }}/>

            {/* Avatar with glow ring */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <div style={{
                position: 'absolute', inset: -8, borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #7de9ff, #6366f1)',
                opacity: 0.4, animation: 'nebulaRotate 6s linear infinite',
              }}/>
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 900, color: '#fff',
                position: 'relative', zIndex: 1,
                border: '3px solid rgba(99,102,241,0.5)',
                boxShadow: '0 0 30px rgba(99,102,241,0.35)',
              }}>
                {profile?.name?.[0]?.toUpperCase()}
              </div>
            </div>

            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.2rem' }}>{profile?.name}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>{profile?.email}</p>

            {profile?.college && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '999px', padding: '0.2rem 0.85rem',
                fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.75rem',
              }}>
                🎓 {profile.college}{profile.graduationYear && ` '${String(profile.graduationYear).slice(-2)}`}
              </div>
            )}

            {profile?.bio && (
              <p style={{
                fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-muted)',
                marginBottom: '0.85rem', padding: '0 0.25rem',
              }}>{profile.bio}</p>
            )}

            {/* Skills */}
            {profile?.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {profile.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            )}

            <button
              className={`btn btn-full btn-sm ${editing ? 'btn-ghost' : 'btn-primary'}`}
              onClick={() => setEditing(!editing)}
              style={{ marginTop: '0.25rem' }}
            >
              {editing ? '✕ Cancel Editing' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* ── Level + XP card ── */}
          <div className="card card-glow" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Level Progress</span>
              <span style={{
                background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
                borderRadius: '999px', padding: '0.15rem 0.65rem',
                fontSize: '0.75rem', fontWeight: 800, color: '#fff',
              }}>Lv. {profile?.level || 1}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, color: '#fff', fontSize: '1rem',
                boxShadow: '0 0 16px rgba(99,102,241,0.4)', flexShrink: 0,
              }}>⚡</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{xpInLvl} / 500 XP</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{xpPct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${xpPct}%` }}/>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textAlign: 'center' }}>
              {500 - xpInLvl} XP to Level {(profile?.level || 1) + 1}
            </div>
          </div>

          {/* ── Stats card ── */}
          <div className="card">
            <h3 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '0.75rem' }}>Stats</h3>
            <StatRow icon="⚡" label="Total XP"       value={profile?.xp?.toLocaleString() || 0}        color="var(--primary)" />
            <StatRow icon="🔥" label="Current Streak" value={`${profile?.streak || 0} days`}             color="var(--warning)" />
            <StatRow icon="🏆" label="Best Streak"    value={`${profile?.maxStreak || 0} days`}          color="var(--secondary)" />
            <StatRow icon="✅" label="Total Solved"   value={solved.length}                              color="var(--success)" />
            <div style={{ marginTop: '0.1rem' }} />
          </div>

          {/* ── Badges card ── */}
          {profile?.badges?.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '0.9rem' }}>
                🏅 Badges Earned ({profile.badges.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {profile.badges.map(b => (
                  <div
                    key={b.name}
                    data-tooltip={b.name}
                    style={{
                      width: 44, height: 44, borderRadius: 'var(--radius)',
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-sm)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {b.icon}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════
            RIGHT PANEL
            ════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ── Edit form ── */}
          {editing && (
            <div className="card animate-slide" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#7de9ff)' }}/>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✏️ Edit Profile
              </h3>
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>College / University</label>
                    <input value={form.college || ''} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="IIT Delhi" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input type="number" min="2020" max="2030" value={form.graduationYear || ''} onChange={e => setForm({ ...form, graduationYear: e.target.value })} placeholder="2026" />
                  </div>
                  <div className="form-group">
                    <label>Skills (comma separated)</label>
                    <input value={form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, DSA, Python" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea rows={3} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself..." />
                </div>
                <div className="form-group">
                  <label>New Password <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                  <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? <><span className="spinner spinner-sm"/> Saving...</> : '💾 Save Changes'}
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* ── Problem Progress ── */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <h3 style={{ fontWeight: 800, margin: 0 }}>Problem Progress</h3>
              <span style={{
                background: 'rgba(74,222,128,0.12)', color: 'var(--success)',
                borderRadius: '999px', padding: '0.2rem 0.75rem',
                fontSize: '0.75rem', fontWeight: 700,
              }}>{solved.length} Solved</span>
            </div>

            {/* Difficulty breakdown */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <DiffPill diff="Easy"   count={easy}   />
              <DiffPill diff="Medium" count={medium} />
              <DiffPill diff="Hard"   count={hard}   />
            </div>

            {/* Overall progress bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>Overall completion</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{solved.length} / 100</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${Math.min(100, solved.length)}%`, background: 'linear-gradient(90deg,var(--success),var(--tertiary))' }}/>
              </div>
            </div>

            {/* Recent solved */}
            {solved.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '0.6rem' }}>
                  Recently Solved
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {solved.slice(-6).reverse().map((p, i) => (
                    <div
                      key={p._id || i}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.55rem 0.85rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(68,71,86,0.25)',
                        borderRadius: 'var(--radius)',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.title}</span>
                      <span className={`badge badge-${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!solved.length && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-faint)', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                Start solving problems to track your progress here!
              </div>
            )}
          </div>

          {/* ── Activity Heatmap placeholder ── */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 800, margin: 0 }}>Submission Activity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                <span>Less</span>
                {[0,1,2,3,4].map(l => (
                  <div key={l} className="heatmap-cell" data-level={l} style={{ width: 10, height: 10 }}/>
                ))}
                <span>More</span>
              </div>
            </div>
            <div className="heatmap">
              {Array.from({ length: 52 * 7 }).map((_, i) => {
                const rand = Math.random();
                const level = rand > 0.85 ? 4 : rand > 0.7 ? 3 : rand > 0.55 ? 2 : rand > 0.4 ? 1 : 0;
                return (
                  <div
                    key={i}
                    className="heatmap-cell"
                    data-level={level}
                    data-tooltip={level > 0 ? `${level} submission${level > 1 ? 's' : ''}` : 'No submissions'}
                  />
                );
              })}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.6rem', textAlign: 'right' }}>
              Last 12 months
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
