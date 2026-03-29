import { DIFFICULTY_COLORS } from '../../data/companyData';

const CompanyCard = ({ company, onClick, style }) => {
  const diff = DIFFICULTY_COLORS[company.difficulty] || DIFFICULTY_COLORS.Medium;

  // Initials avatar
  const initials = company.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div
      onClick={() => onClick?.(company)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid var(--border)`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.35rem',
        cursor: 'pointer',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        ...style,
      }}
    >
      {/* Gradient top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: company.colorGrad,
        borderRadius: '18px 18px 0 0',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: '12px',
          background: company.colorGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', fontWeight: 900, color: '#fff',
          letterSpacing: '-0.02em', flexShrink: 0,
        }}>
          {company.emoji || initials}
        </div>

        {/* Difficulty badge */}
        <span style={{
          background: diff.bg, color: diff.text,
          border: `1px solid ${diff.border}`,
          borderRadius: '999px', fontSize: '0.7rem',
          fontWeight: 700, padding: '0.2rem 0.65rem',
          letterSpacing: '0.04em',
        }}>
          {company.difficulty}
        </span>
      </div>

      {/* Company name + industry */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.2rem' }}>
          {company.name}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 500 }}>
          🏢 {company.industry}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {company.tags?.slice(0, 3).map(t => (
          <span key={t} style={{
            background: 'var(--bg-glass)', color: 'var(--text-muted)',
            border: '1px solid var(--border)', borderRadius: '6px',
            fontSize: '0.7rem', fontWeight: 500, padding: '0.15rem 0.5rem',
          }}>{t}</span>
        ))}
      </div>

      {/* Tech stack pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {company.techStack?.slice(0, 5).map(t => (
          <span key={t} style={{
            background: `${company.colorPrimary}18`,
            color: company.colorPrimary,
            borderRadius: '5px', fontSize: '0.68rem',
            fontWeight: 600, padding: '0.12rem 0.45rem',
          }}>{t}</span>
        ))}
        {company.techStack?.length > 5 && (
          <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', padding: '0.12rem 0.2rem' }}>
            +{company.techStack.length - 5}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: 'auto' }}>
        {company.avgPackage && <span>💰 {company.avgPackage}</span>}
        <span>❓ {company.technicalQuestions?.length + company.behavioralQuestions?.length || 20} Qs</span>
        <span>🔄 {company.rounds?.length || 4} Rounds</span>
      </div>
    </div>
  );
};

export default CompanyCard;
