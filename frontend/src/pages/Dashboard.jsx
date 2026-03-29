import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardAnalytics } from '../services/analyticsService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

const QuickLink = ({ to, icon, label, color }) => (
  <Link to={to} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem', textAlign: 'center', textDecoration: 'none' }}>
    <div style={{ fontSize: '1.8rem', width: 48, height: 48, borderRadius: 'var(--radius)', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getDashboardAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader />;

  const diffData = data ? Object.entries(data.byDifficulty).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })) : [];
  const xpInLevel = (data?.xp || 0) % 500;
  const xpPct = Math.round((xpInLevel / 500) * 100);

  return (
    <div className="animate-fade">
      {/* Welcome */}
      <div className="flex-between mb-3">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted text-sm">Keep up the momentum — you're doing great!</p>
        </div>
        <Link to="/roadmap" className="btn btn-primary hide-mobile">🗺️ My Roadmap</Link>
      </div>

      {/* Top Stats */}
      <div className="grid-4 mb-3">
        <div className="stat-card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <div style={{ fontSize: '2rem' }}>🔥</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{data?.streak || 0}</div>
          <div className="stat-label">Day Streak</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>Best: {data?.maxStreak || 0}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--success)' }}>
          <div style={{ fontSize: '2rem' }}>✅</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{data?.totalSolved || 0}</div>
          <div className="stat-label">Problems Solved</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>of {data?.totalProblems || 0}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div style={{ fontSize: '2rem' }}>⚡</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{data?.xp || 0}</div>
          <div className="stat-label">XP Points</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>Level {data?.level || 1}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--secondary)' }}>
          <div style={{ fontSize: '2rem' }}>🧠</div>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>{data?.totalAptitudeSolved || 0}</div>
          <div className="stat-label">Aptitude Solved</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>of {data?.totalAptitude || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* XP Progress */}
        <div className="card">
          <div className="flex-between mb-2">
            <h3 className="section-title" style={{ margin: 0 }}>Level Progress</h3>
            <span className="badge badge-primary">Level {data?.level || 1}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
              {data?.level || 1}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex-between mb-1">
                <span className="text-sm">{xpInLevel} / 500 XP</span>
                <span className="text-sm text-primary">{xpPct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
          {data?.badges?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {data.badges.map(b => (
                <span key={b.name} data-tooltip={b.name} style={{ fontSize: '1.3rem', cursor: 'default' }}>{b.icon}</span>
              ))}
            </div>
          )}
        </div>

        {/* Problems Chart */}
        <div className="card">
          <h3 className="section-title">Problems by Difficulty</h3>
          {diffData.length ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={diffData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {diffData.map(e => <Cell key={e.name} fill={DIFF_COLORS[e.name]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-center" style={{ height: 160, color: 'var(--text-faint)', fontSize: '0.875rem' }}>
              Solve problems to see chart
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {Object.entries(data?.byDifficulty || {}).map(([d, v]) => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: DIFF_COLORS[d] }}>{v}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <h3 className="section-title">Quick Access</h3>
      <div className="grid-4 mb-3">
        <QuickLink to="/dsa" icon="🧮" label="100 DSA" color="#6366f1" />
        <QuickLink to="/ide" icon="⌨️" label="Code IDE" color="#10b981" />
        <QuickLink to="/games" icon="🎮" label="Brain Games" color="#ec4899" />
        <QuickLink to="/programming" icon="💻" label="Programming" color="#8b5cf6" />
        <QuickLink to="/aptitude" icon="🧠" label="Aptitude" color="#06b6d4" />
        <QuickLink to="/tests" icon="📋" label="Mock Tests" color="#f59e0b" />
        <QuickLink to="/companies" icon="🏢" label="Company Prep" color="#22c55e" />
        <QuickLink to="/notes" icon="📝" label="Notes" color="#a78bfa" />
        <QuickLink to="/roadmap" icon="🗺️" label="Roadmap" color="#ef4444" />
      </div>

      {/* Weak Topics */}
      {data?.weakTopics?.length > 0 && (
        <div className="card mb-3">
          <div className="flex-between mb-2">
            <h3 className="section-title" style={{ margin: 0 }}>⚠️ Focus Areas</h3>
            <Link to="/analytics" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {data.weakTopics.slice(0, 3).map(t => (
              <div key={t.category} style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: '0.6rem 1rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{t.category}</span>
                <span className="text-faint" style={{ marginLeft: '0.5rem' }}>{t.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      {data?.recentSubmissions?.length > 0 && (
        <div className="card">
          <div className="flex-between mb-2">
            <h3 className="section-title" style={{ margin: 0 }}>Recent Activity</h3>
            <Link to="/programming" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {data.recentSubmissions.slice(0, 5).map(s => (
              <div key={s._id} className="flex-between" style={{ padding: '0.6rem 0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.875rem' }}>{s.problem?.title}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge badge-${s.problem?.difficulty?.toLowerCase()}`}>{s.problem?.difficulty}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.status === 'Accepted' ? 'var(--success)' : 'var(--danger)' }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
