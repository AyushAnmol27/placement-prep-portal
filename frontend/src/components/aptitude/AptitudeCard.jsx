import { getCategoryIcon } from '../../utils/aptitudeUtils';

const AptitudeCard = ({ question, onSelect }) => (
  <div
    className="card"
    style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', cursor: 'pointer' }}
    onClick={() => onSelect(question)}
  >
    <div className="flex-between">
      <span style={{ fontSize: '1.2rem' }}>{getCategoryIcon(question.category)}</span>
      <span className={`badge badge-${question.difficulty?.toLowerCase()}`}>{question.difficulty}</span>
    </div>
    <p style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>
      {question.question.slice(0, 100)}{question.question.length > 100 ? '...' : ''}
    </p>
    <div className="flex-between">
      <span className="text-muted text-sm">{question.category}</span>
      <span className="text-muted text-sm">{question.options?.length} options</span>
    </div>
  </div>
);

export default AptitudeCard;
