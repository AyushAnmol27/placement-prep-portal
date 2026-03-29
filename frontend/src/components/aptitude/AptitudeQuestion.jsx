import { useState } from 'react';
import { submitAnswer } from '../../services/aptitudeService';
import { getScoreColor } from '../../utils/aptitudeUtils';

const AptitudeQuestion = ({ question, onClose, onCorrect }) => {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selected === null || loading) return;
    setLoading(true);
    try {
      const res = await submitAnswer(question._id, selected);
      setResult(res);
      if (res.correct) onCorrect?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex-between">
        <span className="text-muted text-sm">{question.category} · {question.difficulty}</span>
        <button className="btn btn-ghost" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }} onClick={onClose}>✕</button>
      </div>
      <p style={{ fontWeight: 500, lineHeight: 1.6 }}>{question.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {question.options.map((opt, i) => {
          let bg = 'transparent';
          let border = 'var(--border)';
          if (result) {
            if (i === result.correctAnswer) { bg = 'rgba(34,197,94,0.15)'; border = 'var(--success)'; }
            else if (i === selected && !result.correct) { bg = 'rgba(239,68,68,0.15)'; border = 'var(--danger)'; }
          } else if (selected === i) {
            bg = 'rgba(99,102,241,0.15)'; border = 'var(--primary)';
          }
          return (
            <label key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: result ? 'default' : 'pointer',
              background: bg, border: `1px solid ${border}`, transition: 'all 0.15s',
            }}>
              <input type="radio" name="option" checked={selected === i}
                onChange={() => !result && setSelected(i)} style={{ width: 'auto' }} />
              {opt}
            </label>
          );
        })}
      </div>
      {result ? (
        <div>
          <p style={{ fontWeight: 600, color: getScoreColor(result.correct ? 100 : 0) }}>
            {result.correct ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {result.explanation && <p className="text-muted text-sm" style={{ marginTop: '0.4rem' }}>💡 {result.explanation}</p>}
          <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={onClose}>Next Question</button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={handleSubmit} disabled={selected === null || loading}>
          {loading ? 'Checking...' : 'Submit Answer'}
        </button>
      )}
    </div>
  );
};

export default AptitudeQuestion;
