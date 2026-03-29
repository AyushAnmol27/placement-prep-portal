const Loader = ({ fullPage = false, text = '' }) => (
  <div
    className="flex-center"
    style={{
      height: fullPage ? '100vh' : '220px',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    {/* Nested ring spinner */}
    <div style={{ position: 'relative', width: 48, height: 48 }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '2.5px solid rgba(163,166,255,0.15)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}/>
      {/* Middle ring */}
      <div style={{
        position: 'absolute', inset: 8,
        border: '2px solid rgba(172,138,255,0.12)',
        borderTopColor: 'var(--secondary)',
        borderRadius: '50%',
        animation: 'spin 1.2s linear infinite reverse',
      }}/>
      {/* Center dot */}
      <div style={{
        position: 'absolute', inset: 18,
        background: 'var(--tertiary)',
        borderRadius: '50%',
        opacity: 0.8,
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: '0 0 8px rgba(125,233,255,0.6)',
      }}/>
    </div>

    {text && (
      <span style={{
        fontSize: '0.78rem', color: 'var(--text-faint)',
        fontWeight: 500, letterSpacing: '0.04em',
      }}>
        {text}
      </span>
    )}
  </div>
);

export default Loader;
