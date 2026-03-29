import { useState } from 'react';
import { solveProblem } from '../../services/problemService';

const ProblemCard = ({ problem, isSolved, onSolved, onOpenEditor }) => {
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (isSolved || loading) return;
    setLoading(true);
    try {
      const result = await solveProblem(problem._id);
      onSolved(problem._id, result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div className="flex-between">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{problem.title}</h3>
        <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
      </div>
      <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
        {problem.description?.slice(0, 100)}...
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {problem.tags?.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="flex-between" style={{ marginTop: '0.4rem' }}>
        <span className="text-sm text-muted">{problem.platform}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {problem.link && (
            <a href={problem.link} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
              Open ↗
            </a>
          )}
          <button
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
            onClick={() => onOpenEditor?.(problem)}
          >
            {'</>'}
          </button>
          <button
            className={`btn ${isSolved ? 'btn-ghost' : 'btn-primary'}`}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
            onClick={handleSolve}
            disabled={isSolved || loading}
          >
            {isSolved ? '✓ Solved' : loading ? '...' : 'Mark Solved'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
