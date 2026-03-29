import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const XPBar = ({ xp, level }) => {
  const xpInLevel = xp % 500;
  const pct = Math.round((xpInLevel / 500) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} data-tooltip={`${xpInLevel}/500 XP to Level ${level + 1}`}>
      <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.02em' }}>Lv.{level}</span>
      <div style={{ width: '64px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '2px', transition: 'width 0.6s ease', boxShadow: '0 0 6px rgba(99,102,241,0.6)' }} />
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--navbar-height)', zIndex: 200,
      background: 'rgba(8, 12, 24, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.75rem',
    }}>
      {/* Bottom gradient line */}
      <div className="navbar-glow" />

      {/* Logo */}
      <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.1rem' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 'var(--radius)',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', boxShadow: '0 0 16px rgba(99,102,241,0.4)',
        }}>🎯</div>
        <span style={{
          background: 'linear-gradient(135deg, #a5b4fc, #e879f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.02em',
        }}>
          PlacementPrep
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme toggle */}
        <button
          className="btn btn-icon btn-ghost"
          onClick={toggle}
          data-tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{ fontSize: '1rem' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            {/* Streak */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.7rem',
                color: 'var(--warning)', fontWeight: 800, fontSize: '0.82rem',
              }}
              data-tooltip={`${user.streak} day streak`}
            >
              🔥 {user.streak || 0}
            </div>

            {/* XP Bar */}
            <div className="hide-mobile">
              <XPBar xp={user.xp || 0} level={user.level || 1} />
            </div>

            {/* Avatar + Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.8rem 0.3rem 0.3rem',
                  cursor: 'none',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 800, color: '#fff',
                  boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }} className="hide-mobile">
                  {user.name?.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>▼</span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'rgba(12, 18, 38, 0.95)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.5rem',
                    minWidth: '190px',
                    boxShadow: 'var(--shadow-lg), var(--shadow-glow-sm)',
                    zIndex: 300,
                    animation: 'slideUp 0.2s ease',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { to: '/profile', label: '👤 Profile' },
                    { to: '/analytics', label: '📊 Analytics' },
                    { to: '/dsa', label: '🧮 100 DSA Problems' },
                    { to: '/games', label: '🎮 Brain Games' },
                  ].map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)',
                        color: 'var(--text-muted)', fontSize: '0.875rem',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', color: 'var(--warning)', fontSize: '0.875rem' }}>
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <div style={{ height: '1px', background: 'var(--border)', margin: '0.4rem 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)',
                      color: 'var(--danger)', fontSize: '0.875rem',
                      width: '100%', background: 'transparent',
                      fontFamily: 'inherit',
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
