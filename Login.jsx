import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login as loginService } from '../services/authService';

const FloatingParticle = ({ size, x, y, delay, color }) => (
  <div style={{
    position: 'absolute',
    width: size, height: size,
    borderRadius: '50%',
    background: color,
    left: x, top: y,
    opacity: 0.35,
    filter: 'blur(1px)',
    animation: `float ${3 + delay}s ease-in-out ${delay}s infinite`,
    pointerEvents: 'none',
  }} />
);

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginService(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-200px', left: '-100px', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-150px', right: '-100px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 250, height: 250, top: '40%', right: '10%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 5s ease-in-out infinite' }} />
        {/* Floating dots */}
        <FloatingParticle size="6px" x="15%" y="20%" delay={0} color="var(--primary)" />
        <FloatingParticle size="4px" x="75%" y="15%" delay={1} color="var(--secondary)" />
        <FloatingParticle size="5px" x="85%" y="60%" delay={2} color="var(--accent)" />
        <FloatingParticle size="3px" x="25%" y="75%" delay={0.5} color="var(--accent2)" />
      </div>

      {/* Back to home */}
      <Link to="/" style={{
        position: 'absolute', top: '1.5rem', left: '1.75rem',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', boxShadow: '0 0 12px rgba(99,102,241,0.4)',
        }}>🎯</div>
        PlacementPrep
      </Link>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(18, 27, 52, 0.85)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '24px',
        padding: '2.5rem',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(99,102,241,0.1)',
        animation: 'slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
      }}>
        {/* Card top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
        }} />

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            fontSize: '1.4rem', marginBottom: '1.25rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>
            👋
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800,
            fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to continue your prep journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address (e.g., user@domain.com)"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-faint)',
                  fontSize: '1rem', cursor: 'none', padding: '0.25rem',
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mb-2" style={{ fontSize: '0.82rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: '0.25rem', padding: '0.85rem', fontSize: '0.95rem', borderRadius: 'var(--radius)' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="spinner spinner-sm" /> Signing in...
              </span>
            ) : '✨ Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
