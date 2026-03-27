const STATUS_COLORS = {
  3: 'var(--success)',
  4: 'var(--danger)',
  5: 'var(--danger)',
  6: 'var(--danger)',
};

const SubmissionResult = ({ result }) => {
  if (!result) return null;
  const color = STATUS_COLORS[result.status?.id] || 'var(--warning)';

  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex-between mb-1">
        <span style={{ fontWeight: 600, color }}>{result.status?.description}</span>
        <span className="text-muted text-sm">
          {result.time && `${result.time}s`} {result.memory && `· ${result.memory}KB`}
        </span>
      </div>
      {(result.stdout || result.stderr || result.compile_output) && (
        <pre style={{
          fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text)',
          background: 'var(--bg)', padding: '0.75rem', borderRadius: '6px',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '0.5rem',
        }}>
          {result.stdout || result.stderr || result.compile_output}
        </pre>
      )}
    </div>
  );
};

export default SubmissionResult;
