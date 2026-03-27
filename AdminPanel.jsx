import { useEffect, useState } from 'react';
import { getAdminOverview, getUsers, updateUser, deleteUser } from '../services/adminService';
import { createProblem, deleteProblem } from '../services/problemService';
import { createQuestion, deleteQuestion } from '../services/aptitudeService';
import { createTest, deleteTest } from '../services/testService';
import Loader from '../components/common/Loader';
const TABS = ['Overview', 'Users', 'Problems', 'Aptitude', 'Tests'];

const AdminPanel = () => {
  const [tab, setTab] = useState('Overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    if (tab === 'Overview') {
      getAdminOverview().then(setOverview).finally(() => setLoading(false));
    } else if (tab === 'Users') {
      getUsers({ search }).then(d => setUsers(d.users)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tab, search]);

  const handleRoleToggle = async (id, role) => {
    const updated = await updateUser(id, { role: role === 'admin' ? 'user' : 'admin' });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role: updated.role } : u));
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
         <div style={{ position: 'absolute', top: -100, left: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
         <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>
            ⚙️ System Management
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Admin <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Panel</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Manage users, content, tests, and platform settings.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        {TABS.map(t => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', fontFamily: 'inherit',
                border: active ? '1px solid var(--primary)' : '1px solid transparent',
                background: active ? 'var(--primary-light)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s', cursor: 'pointer',
              }}>
              {t}
            </button>
          );
        })}
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Overview */}
          {tab === 'Overview' && overview && (
            <div className="animate-slide">
              <div className="grid-3 mb-4" style={{ gap: '1.5rem' }}>
                {[
                  { label: 'Total Users', value: overview.users, icon: '👥', color: '#6366f1' },
                  { label: 'Problems', value: overview.problems, icon: '💻', color: '#22c55e' },
                  { label: 'Mock Tests', value: overview.tests, icon: '📋', color: '#f59e0b' },
                  { label: 'Aptitude Qs', value: overview.aptitude, icon: '🧠', color: '#ec4899' },
                  { label: 'Companies', value: overview.companies, icon: '🏢', color: '#0ea5e9' },
                  { label: 'Blog Posts', value: overview.blogs, icon: '✍️', color: '#8b5cf6' },
                ].map((s, i) => (
                  <div key={s.label} className="card card-hover" style={{
                    padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
                    background: 'linear-gradient(135deg, rgba(31,37,55,0.4) 0%, rgba(18,27,52,0.6) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, ${s.color}20 0%, transparent 60%)` }} />
                    <div style={{
                      width: 56, height: 56, borderRadius: '1rem',
                      background: `${s.color}15`, border: `1px solid ${s.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginTop: '0.2rem' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>🕒 Recent Signups</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {overview.recentUsers?.map((u, i) => (
                    <div key={u._id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem 1.5rem',
                      borderBottom: i < overview.recentUsers.length - 1 ? '1px solid var(--border-light)' : 'none',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                           {u.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{u.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.email}</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{u.role}</span>
                        <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'Users' && (
            <div className="animate-slide">
              <div className="flex-between mb-3">
                <div style={{ position: 'relative', width: '300px' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
                  <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
                </div>
                <span className="badge badge-primary">{users.length} users</span>
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1.5fr 100px 100px 120px', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>
                  <span>Name</span><span>Email</span><span>Role</span><span>XP</span><span>Actions</span>
                </div>
                {users.map((u, i) => (
                  <div key={u._id} className="card-hover" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1.5fr 100px 100px 120px', gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center', borderBottom: i < users.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>
                         {u.name.charAt(0).toUpperCase()}
                       </div>
                       <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{u.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</span>
                    <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`} style={{ justifySelf: 'start' }}>{u.role}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 800 }}>{u.xp || 0}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleRoleToggle(u._id, u.role)} title="Toggle Role" style={{ padding: '0.4rem' }}>
                        {u.role === 'admin' ? '👤' : '🔑'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeactivate(u._id)} title="Delete User" style={{ padding: '0.4rem', color: 'var(--danger)' }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
                {!users.length && (
                   <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                     <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                     <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>No users found</div>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Problems, Aptitude, Tests — link to their pages */}
          {['Problems', 'Aptitude', 'Tests'].includes(tab) && (
            <div className="card flex-center animate-slide" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px dashed var(--border)' }}>
              <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite' }}>{tab === 'Problems' ? '💻' : tab === 'Aptitude' ? '🧠' : '📋'}</div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manage {tab}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Use the Add buttons on the respective {tab} pages to create and manage content. Admin CRUD controls are available inline on those pages.
                </p>
                <a href={`/${tab.toLowerCase()}`} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                  Go to {tab} →
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default AdminPanel;
