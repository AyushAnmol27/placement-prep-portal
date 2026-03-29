import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NAV = [
  { section: 'Main' },
  { to: '/dashboard',   label: 'Dashboard',   icon: '🏠' },
  { to: '/analytics',   label: 'Analytics',   icon: '📊' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { section: 'Practice' },
  { to: '/dsa',         label: '100 DSA',     icon: '🧮', badge: 'NEW' },
  { to: '/ide',         label: 'Code IDE',    icon: '⌨️', badge: 'NEW' },
  { to: '/programming', label: 'Programming', icon: '💻' },
  { to: '/aptitude',    label: 'Aptitude',    icon: '🧠' },
  { to: '/companies',   label: 'Company Prep',icon: '🏢' },
  { to: '/tests',       label: 'Mock Tests',  icon: '📋' },
  { section: 'Fun' },
  { to: '/games',       label: 'Brain Games', icon: '🎮', badge: 'NEW' },
  { section: 'Learn' },
  { to: '/notes',       label: 'Notes',       icon: '📝' },
  { to: '/roadmap',     label: 'Roadmap',     icon: '🗺️' },
  { to: '/blog',        label: 'Blog',        icon: '✍️' },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const allNav = isAdmin
    ? [...NAV, { section: 'Admin' }, { to: '/admin', label: 'Admin Panel', icon: '⚙️' }]
    : NAV;

  return (
    <aside style={{
      position: 'fixed',
      top: 'var(--navbar-height)',
      left: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'rgba(8, 12, 24, 0.92)',
      borderRight: '1px solid var(--border)',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '1rem 0 2rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
    }}>
      {/* Sidebar glow top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
      }} />

      {allNav.map((item, i) => {
        if (item.section) return (
          <div key={i} style={{
            padding: '1rem 1.25rem 0.35rem',
            fontSize: '0.62rem',
            fontWeight: 800,
            color: 'var(--text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            {item.section}
          </div>
        );

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                fontSize: '0.55rem',
                fontWeight: 800,
                padding: '0.1rem 0.4rem',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.05em',
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
