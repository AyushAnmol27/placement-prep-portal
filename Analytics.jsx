import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../services/analyticsService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import Loader from '../components/common/Loader';

const COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const BAR_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getDashboardAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader />;
  if (!data) return <p className="text-muted text-center mt-4">Failed to load analytics.</p>;

  const diffData = Object.entries(data.byDifficulty).map(([name, value]) => ({ name, value }));
  const aptData = Object.entries(data.aptByCategory || {}).map(([name, value]) => ({ name, value }));
  const testData = data.testScores?.map((s, i) => ({ test: `T${i + 1}`, score: s.score })) || [];

  return (
    <div className="animate-fade">
      <h1 className="page-title">Analytics</h1>

      {/* Top Stats */}
      <div className="grid-4 mb-3">
        {[
          { label: 'Problems Solved', value: data.totalSolved, sub: `of ${data.totalProblems}`, icon: '✅', color: 'var(--success)' },
          { label: 'Aptitude Solved', value: data.totalAptitudeSolved, sub: `of ${data.totalAptitude}`, icon: '🧠', color: 'var(--primary)' },
          { label: 'Current Streak', value: `${data.streak} 🔥`, sub: `Best: ${data.maxStreak}`, icon: '🔥', color: 'var(--warning)' },
          { label: 'XP Points', value: data.xp, sub: `Level ${data.level}`, icon: '⚡', color: 'var(--secondary)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Problems by Difficulty */}
        <div className="card">
          <h3 className="section-title">Problems by Difficulty</h3>
          {diffData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={diffData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {diffData.map(e => <Cell key={e.name} fill={COLORS[e.name] || '#6366f1'} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-sm text-center mt-3">No data yet</p>}
        </div>

        {/* Aptitude by Category */}
        <div className="card">
          <h3 className="section-title">Aptitude by Category</h3>
          {aptData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={aptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {aptData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-sm text-center mt-3">No data yet</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Test Performance */}
        <div className="card">
          <h3 className="section-title">Test Performance</h3>
          {testData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={testData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="test" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(v) => [`${v}%`, 'Score']} />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-sm text-center mt-3">No tests taken yet</p>}
        </div>

        {/* Top Tags */}
        <div className="card">
          <h3 className="section-title">Top Problem Tags</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {data.topTags?.length ? data.topTags.map(t => (
              <div key={t.tag} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', width: '100px', color: 'var(--text-muted)', flexShrink: 0 }}>{t.tag}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(100, (t.count / (data.topTags[0]?.count || 1)) * 100)}%` }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', width: '24px', textAlign: 'right' }}>{t.count}</span>
              </div>
            )) : <p className="text-muted text-sm">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      {data.weakTopics?.length > 0 && (
        <div className="card mb-3">
          <h3 className="section-title">⚠️ Weak Areas — Focus Here</h3>
          <div className="grid-3">
            {data.weakTopics.map(t => (
              <div key={t.category} style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: '0.85rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>{t.category}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.solved}/{t.total} solved ({t.percentage}%)</div>
                <div className="progress-bar mt-1">
                  <div style={{ height: '100%', width: `${t.percentage}%`, background: 'var(--danger)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      {data.recentSubmissions?.length > 0 && (
        <div className="card">
          <h3 className="section-title">Recent Submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.recentSubmissions.map(s => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.875rem' }}>{s.problem?.title}</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className={`badge badge-${s.problem?.difficulty?.toLowerCase()}`}>{s.problem?.difficulty}</span>
                  <span style={{ fontSize: '0.75rem', color: s.status === 'Accepted' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
