import { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../services/notesService';
import { timeAgo } from '../utils/dateUtils';
import NotesEditor from '../components/notes/NotesEditor';
import Loader from '../components/common/Loader';

/* ── tag color palette (cycles) ── */
const TAG_COLORS = [
  { bg: 'rgba(99,102,241,0.12)',  text: '#a3a6ff', border: 'rgba(99,102,241,0.3)'  },
  { bg: 'rgba(125,233,255,0.1)',  text: '#7de9ff', border: 'rgba(125,233,255,0.25)' },
  { bg: 'rgba(172,138,255,0.12)', text: '#ac8aff', border: 'rgba(172,138,255,0.3)' },
  { bg: 'rgba(74,222,128,0.1)',   text: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  { bg: 'rgba(251,191,36,0.1)',   text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
];

const TagChip = ({ tag, idx }) => {
  const c = TAG_COLORS[idx % TAG_COLORS.length];
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: '999px', padding: '0.12rem 0.6rem',
      fontSize: '0.68rem', fontWeight: 700,
    }}>
      {tag}
    </span>
  );
};

/* ── single note card ── */
const NoteCard = ({ note, onEdit, onDelete, idx }) => {
  const ACCENT_GRADS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#06b6d4,#6366f1)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#22c55e,#06b6d4)',
  ];
  const grad = ACCENT_GRADS[idx % ACCENT_GRADS.length];

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        animation: `slideUp 0.35s ease ${(idx % 6) * 0.05}s both`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: grad, borderRadius: '0 0 2px 2px',
      }}/>

      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.35, flex: 1, marginTop: '0.15rem' }}>
          {note.title}
        </h3>
        <span style={{
          fontSize: '0.65rem', color: 'var(--text-faint)', fontWeight: 500,
          flexShrink: 0, marginTop: '0.2rem',
          background: 'rgba(255,255,255,0.04)', borderRadius: '999px',
          padding: '0.15rem 0.55rem', border: '1px solid rgba(68,71,86,0.3)',
        }}>
          {timeAgo(note.updatedAt)}
        </span>
      </div>

      {/* Content preview */}
      {note.content && (
        <p style={{
          fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {note.content}
        </p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {note.tags.map((t, i) => <TagChip key={t} tag={t} idx={i} />)}
        </div>
      )}

      {/* Attachment */}
      {note.fileUrl && (
        <a
          href={note.fileUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.7rem',
            width: 'fit-content', transition: 'var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
        >
          📎 View Attachment
        </a>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.25rem',
        borderTop: '1px solid rgba(68,71,86,0.2)',
      }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onEdit(note)}
          style={{ flex: 1 }}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-sm"
          onClick={() => onDelete(note._id)}
          style={{
            flex: 1, background: 'rgba(255,110,132,0.08)',
            color: 'var(--danger)', border: '1px solid rgba(255,110,132,0.2)',
            borderRadius: 'var(--radius-full)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,110,132,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,110,132,0.08)'}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

/* ── Main ── */
const Notes = () => {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getNotes().then(setNotes).finally(() => setLoading(false));
  }, []);

  const handleSave = (note, isEdit) => {
    setNotes(prev => isEdit
      ? prev.map(n => n._id === note._id ? note : n)
      : [note, ...prev]
    );
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (note) => { setEditing(note); setShowForm(true); };
  const handleCancel = () => { setShowForm(false); setEditing(null); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase()) ||
    n.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            letterSpacing: '-0.03em', margin: 0,
          }}>
            My{' '}
            <span style={{
              background: 'linear-gradient(135deg,var(--secondary),var(--tertiary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Notes</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} · Capture ideas, snippets &amp; references
          </p>
        </div>
        <button
          className={`btn ${showForm && !editing ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => { handleCancel(); setShowForm(s => !s); }}
          style={{ flexShrink: 0 }}
        >
          {showForm && !editing ? '✕ Cancel' : '✦ New Note'}
        </button>
      </div>

      {/* ── Editor form ── */}
      {showForm && (
        <div style={{ marginBottom: '1.5rem', animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <NotesEditor editing={editing} onSave={handleSave} onCancel={handleCancel} />
        </div>
      )}

      {/* ── Search bar ── */}
      {notes.length > 0 && (
        <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: 380 }}>
          <span style={{
            position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.875rem', color: 'var(--text-faint)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            placeholder="Search notes or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      )}

      {/* ── Notes grid ── */}
      {loading ? <Loader /> : (
        <>
          {filtered.length > 0 ? (
            <div className="grid-2">
              {filtered.map((note, i) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  idx={i}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(24px)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>
                {search ? '🔍' : '📝'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {search ? 'No notes found' : 'No notes yet'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 300, margin: '0 auto 1.5rem' }}>
                {search
                  ? 'Try a different keyword or tag'
                  : 'Create your first note to capture ideas, code snippets, and references.'}
              </p>
              {!search && (
                <button
                  className="btn btn-primary"
                  onClick={() => { setShowForm(true); setSearch(''); }}
                >
                  ✦ Create First Note
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
