import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🧮', title: '100 DSA Problems', desc: 'Curated DSA questions with multi-language code editor. Select from 12+ programming languages.', color: '#6366f1' },
  { icon: '💻', title: 'DSA Problem Tracker', desc: 'Track LeetCode, HackerRank & more with integrated code editor. Filter by difficulty and tag.', color: '#8b5cf6' },
  { icon: '🧠', title: 'Aptitude Practice', desc: 'Quantitative, Logical Reasoning, Verbal & Data Interpretation with instant feedback.', color: '#06b6d4' },
  { icon: '🏢', title: 'Company Prep', desc: 'Company-specific problems, interview processes, roles, and packages for 100+ companies.', color: '#22c55e' },
  { icon: '🔥', title: 'Daily Streak', desc: 'Build consistency with streak tracking. Stay motivated every single day.', color: '#f59e0b' },
  { icon: '📝', title: 'Smart Notes', desc: 'Create notes with attachments. Organize by tags for quick access anytime.', color: '#ec4899' },
  { icon: '📋', title: 'Mock Tests', desc: 'Timed tests with instant scoring, explanations, and performance insights.', color: '#ef4444' },
  { icon: '🎮', title: 'Brain Games', desc: 'Memory Match, Typing Speed, DSA Quiz, and Number Puzzle to make learning fun!', color: '#a78bfa' },
];

const stats = [
  { value: '500+', label: 'Problems', icon: '💻' },
  { value: '50+', label: 'Mock Tests', icon: '📋' },
  { value: '100+', label: 'Companies', icon: '🏢' },
  { value: '10k+', label: 'Students', icon: '🎓' },
];

const HERO_WORDS = ['Placement', 'Interview', 'DSA', 'Aptitude', 'Coding'];

const Landing = () => {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % HERO_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2.5rem', height: '64px',
        background: 'rgba(8,12,24,0.85)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.1rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 16px rgba(99,102,241,0.5)',
          }}>🎯</div>
          <span style={{
            background: 'linear-gradient(135deg, #a5b4fc, #e879f9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', sans-serif",
          }}>PlacementPrep</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started →</Link>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, top: '-200px', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, bottom: '5%', left: '10%', background: 'radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, bottom: '10%', right: '15%', background: 'radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>

        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '999px', padding: '0.35rem 1.1rem',
          marginBottom: '2rem',
          fontSize: '0.82rem', color: 'var(--primary)',
          animation: 'fadeIn 0.6s ease',
          boxShadow: '0 0 20px rgba(99,102,241,0.15)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Your placement journey starts here
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          maxWidth: '860px',
          marginBottom: '0.5rem',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.03em',
          animation: 'slideUp 0.7s ease',
        }}>
          Master{' '}
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease',
            minWidth: '180px',
          }}>
            {HERO_WORDS[wordIdx]}
          </span>
          <br />with Focused Prep
        </h1>

        <p style={{
          fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '580px',
          lineHeight: 1.75, marginBottom: '2.5rem',
          animation: 'slideUp 0.8s ease',
        }}>
          100 DSA problems with code editor in 12+ languages, aptitude practice, company prep,
          mock tests, brain games, and analytics — everything in one place.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.9s ease' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
            Start for Free
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
            Sign In
          </Link>
        </div>

        {/* Hero card */}
        <div style={{
          marginTop: '4.5rem', width: '100%', maxWidth: '900px',
          background: 'rgba(18, 27, 52, 0.8)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px', padding: '1.75rem',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.1)',
          backdropFilter: 'blur(20px)',
          animation: 'slideUp 1s ease',
          position: 'relative',
        }}>
          {/* Top bar */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', alignItems: 'center' }}>
            {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: '0.5rem' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: "'Fira Code', monospace" }}>
              placement-prep-portal
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '0.85rem' }}>
            {[
              { label: 'Problems Solved', value: '142', color: '#22c55e', icon: '✅' },
              { label: 'Current Streak', value: '12 🔥', color: '#f59e0b', icon: '🔥' },
              { label: 'DSA Solved', value: '67/100', color: '#6366f1', icon: '🧮' },
              { label: 'Aptitude Score', value: '87%', color: '#a78bfa', icon: '🧠' },
              { label: 'Games Score', value: '2480', color: '#ec4899', icon: '🎮' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: s.color, fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{s.icon}</div>
              <div style={{
                fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '999px', padding: '0.3rem 0.9rem',
            fontSize: '0.78rem', color: 'var(--primary)', marginBottom: '1rem',
          }}>
            ✨ Everything You Need
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
            fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', marginBottom: '0.75rem',
          }}>
            One Platform.{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              All Your Tools.
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            From DSA to games — everything needed to crack your placement.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(18, 27, 52, 0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '18px',
                padding: '1.5rem',
                backdropFilter: 'blur(12px)',
                animationDelay: `${i * 0.05}s`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                fontSize: '1.6rem', width: '52px', height: '52px',
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontFamily: "'Outfit', sans-serif", fontSize: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${f.color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 1.5rem', textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
          fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', marginBottom: '1rem',
        }}>
          Ready to crack your placement?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Join thousands of students preparing smarter with PlacementPrep.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
            Get Started — It's Free
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '1.75rem 1.5rem',
        textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.82rem',
        background: 'rgba(8,12,24,0.6)',
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
            PlacementPrep Portal
          </span>
        </div>
        © {new Date().getFullYear()} PlacementPrep Portal. Built for students, by students. 💙
      </footer>
    </div>
  );
};

export default Landing;
