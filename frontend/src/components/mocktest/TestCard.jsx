const TestCard = ({ test, onStart }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
    <div className="flex-between">
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{test.title}</h3>
      <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>
        {test.category}
      </span>
    </div>
    {test.description && <p className="text-muted text-sm">{test.description}</p>}
    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
      <span>⏱ {test.duration} min</span>
      <span>❓ {test.questions?.length || 0} questions</span>
      <span>👥 {test.attempts?.length || 0} attempts</span>
    </div>
    <button className="btn btn-primary" style={{ marginTop: '0.25rem' }} onClick={() => onStart(test._id)}>
      Start Test →
    </button>
  </div>
);

export default TestCard;
