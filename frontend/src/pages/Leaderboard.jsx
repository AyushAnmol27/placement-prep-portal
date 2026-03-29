import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/authService';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

/* ── helpers ── */
const MEDAL_CFG = [
  { emoji: '🥇', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', label: '1st', podiumH: 140 },
  { emoji: '🥈', color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', label: '2nd', podiumH: 110 },
  { emoji: '🥉', color: '#cd7f32', glow: 'rgba(205,127,50,0.3)', label: '3rd', podiumH: 85  },
];

const Avatar = ({ name, size = 40, gradient = 'linear-gradient(135deg,#6366f1,#8b5cf6)' }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: gradient,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 800, color: '#fff',
    flexShrink: 0, boxShadow: '0 0 12px rgba(99,102,241,0.4)',
  }}>
    {name?.[0]?.toUpperCase() || '?'}
  </div>
);

/* ── Podium card for top-3 ── */
const PodiumCard = ({ user, cfg, rank }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    flex: rank === 1 ? '0 0 220px' : '0 0 180px',
    order: rank === 2 ? 1 : rank === 1 ? 2 : 3,
  }}>
    {/* Avatar + glow */}
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
        animation: rank === 1 ? 'glowPulse 2.5s ease-in-out infinite' : 'none',
      }}/>
      <div style={{
        width: rank === 1 ? 80 : 64, height: rank === 1 ? 80 : 64, borderRadius: '50%',
        background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? '2rem' : '1.6rem', fontWeight: 800, color: '#fff',
        border: `3px solid ${cfg.color}`,
        boxShadow: `0 0 24px ${cfg.glow}`,
        position: 'relative', zIndex: 1,
      }}>
        {user?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div style={{
        position: 'absolute', bottom: -4, right: -4,
        background: cfg.color, borderRadius: '50%',
        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', zIndex: 2, border: '2px solid var(--bg)',
      }}>{cfg.emoji}</div>
    </div>

    {/* Name */}
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: rank === 1 ? '1rem' : '0.875rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user?.name || '—'}
      </div>
      {user?.college && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.1rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.college}
        </div>
      )}
    </div>

    {/* XP chip */}
    <div style={{
      background: `${cfg.color}18`, border: `1px solid ${cfg.color}44`,
      borderRadius: '999px', padding: '0.2rem 0.85rem',
      fontSize: '0.78rem', fontWeight: 700, color: cfg.color,
    }}>
      {user?.xp?.toLocaleString() || 0} XP
    </div>

    {/* Podium block */}
    <div style={{
      width: '100%', height: cfg.podiumH,
      background: `linear-gradient(to bottom, ${cfg.color}28, ${cfg.color}08)`,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: rank === 1 ? '2rem' : '1.5rem', fontWeight: 900,
      color: cfg.color, userSelect: 'none',
    }}>
      {cfg.label}
    </div>
  </div>
);

/* ── Main ── */
const Leaderboard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' | 'me'

  useEffect(() => {
    getLeaderboard().then(setBoard).finally(() => setLoading(false));
  }, []);

  const myEntry = board.find(u => u._id === user?._id);
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  return (
    <div className="animate-fade">

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 160,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '999px', padding: '0.2rem 0.85rem', marginBottom: '0.65rem',
              fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600,
            }}>
              🏆 Live Rankings
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em', margin: 0,
            }}>
              Leaderboard{' '}
              <span style={{
                background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Rankings</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Top performers across XP, problems solved, and streaks
            </p>
          </div>
          {myEntry && (
            <div style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.15rem' }}>Your Rank</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>#{myEntry.rank}</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--border)' }}/>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                {[
                  { label: 'XP', value: myEntry.xp?.toLocaleString() },
                  { label: 'Solved', value: myEntry.solved },
                  { label: 'Streak', value: `${myEntry.streak}🔥` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{s.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* ── Podium (top 3) ── */}
          {top3.length >= 1 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 2rem 0',
              backdropFilter: 'blur(24px)',
              marginBottom: '1.5rem',
              overflow: 'hidden', position: 'relative',
            }}>
              {/* Nebula bg glow */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -80, left: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', borderRadius: '50%' }}/>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
                {top3.map((u, i) => (
                  <PodiumCard key={u._id} user={u} cfg={MEDAL_CFG[i]} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* ── Summary stats ── */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Students', value: board.length, icon: '👥', color: 'var(--primary)' },
              { label: 'Highest XP', value: board[0]?.xp?.toLocaleString() || 0, icon: '⚡', color: '#f59e0b' },
              { label: 'Max Streak', value: `${Math.max(...board.map(u => u.streak || 0))}🔥`, icon: '🔥', color: 'var(--warning)' },
              { label: 'Most Solved', value: Math.max(...board.map(u => u.solved || 0)), icon: '✅', color: 'var(--success)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex: '1 1 140px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Rank table ── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 90px 70px 80px 80px',
              gap: '0.5rem', padding: '0.7rem 1.25rem',
              borderBottom: '1px solid rgba(68,71,86,0.4)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              {['Rank', 'Student', 'XP', 'Level', 'Solved', 'Streak'].map(h => (
                <span key={h} style={{
                  fontSize: '0.65rem', fontWeight: 800,
                  color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  textAlign: h !== 'Student' ? 'center' : 'left',
                }}>{h}</span>
              ))}
            </div>

            {/* Rest of board (rank 4+) */}
            {rest.map((u, i) => {
              const isMe = u._id === user?._id;
              return (
                <div
                  key={u._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 90px 70px 80px 80px',
                    gap: '0.5rem', padding: '0.85rem 1.25rem',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(68,71,86,0.2)',
                    background: isMe
                      ? 'rgba(99,102,241,0.08)'
                      : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.2s',
                    animation: `slideIn 0.3s ease ${i * 0.03}s both`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isMe ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = isMe ? 'rgba(99,102,241,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                >
                  {/* Rank */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontWeight: 700, fontSize: '0.875rem',
                      color: isMe ? 'var(--primary)' : 'var(--text-muted)',
                    }}>#{u.rank}</span>
                  </div>

                  {/* User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <Avatar name={u.name} size={34} gradient={isMe ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#374151,#4b5563)'} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: isMe ? 700 : 500, fontSize: '0.875rem',
                        color: isMe ? 'var(--primary)' : 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {u.name}{isMe && <span style={{ marginLeft: '0.35rem', fontSize: '0.7rem', background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>You</span>}
                      </div>
                      {u.college && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.college}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* XP */}
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#f59e0b' }}>
                    {u.xp?.toLocaleString() || 0}
                  </div>

                  {/* Level */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      background: 'rgba(99,102,241,0.12)', color: 'var(--primary)',
                      borderRadius: '999px', padding: '0.15rem 0.55rem',
                      fontSize: '0.72rem', fontWeight: 700,
                    }}>Lv.{u.level}</span>
                  </div>

                  {/* Solved */}
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                    {u.solved || 0}
                  </div>

                  {/* Streak */}
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: 'var(--warning)' }}>
                    {u.streak || 0}🔥
                  </div>
                </div>
              );
            })}

            {!board.length && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</div>
                <div style={{ fontWeight: 600 }}>No rankings yet</div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>Start solving problems to appear here!</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
