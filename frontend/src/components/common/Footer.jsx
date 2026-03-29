const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '1rem 1.5rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.82rem',
    background: 'var(--bg-card)',
  }}>
    © {new Date().getFullYear()} PlacementPrep Portal · Built for students, by students.
  </footer>
);

export default Footer;
