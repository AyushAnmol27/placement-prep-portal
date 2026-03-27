import { getStreakMessage } from '../../utils/streakUtils';

const StreakTracker = ({ streak = 0 }) => (
  <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning)' }}>
      🔥 {streak}
    </div>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
      Day Streak
    </div>
    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
      {getStreakMessage(streak)}
    </div>
  </div>
);

export default StreakTracker;
