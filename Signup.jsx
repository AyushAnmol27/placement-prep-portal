import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { register as registerService } from '../services/authService';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const data = await registerService(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 4 ? 1 : form.password.length < 8 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

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
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-100px', right: '-150px', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-100px', left: '-120px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, top: '30%', left: '5%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 4s ease-in-out 1s infinite' }} />
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
        width: '100%', maxWidth: '440px',
        background: 'rgba(18, 27, 52, 0.85)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '24px',
        padding: '2.5rem',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(139,92,246,0.08)',
        animation: 'slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
      }}>
        {/* Card top glow */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)',
        }} />

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--secondary), var(--accent2))',
            fontSize: '1.4rem', marginBottom: '1.25rem',
            boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
          }}>
            🚀
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800,
            fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
          }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Start your placement journey today — it's free!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>

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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '1rem', cursor: 'none', padding: '0.25rem' }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Strength meter */}
            {form.password.length > 0 && (
              <div style={{ marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: strength >= i ? strengthColors[strength] : 'var(--border)',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: strengthColors[strength], fontWeight: 600 }}>
                  {strengthLabels[strength]} password
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger mb-2" style={{ fontSize: '0.82rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: '0.25rem', padding: '0.85rem', fontSize: '0.95rem', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="spinner spinner-sm" /> Creating account...
              </span>
            ) : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
