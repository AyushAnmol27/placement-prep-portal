import { useState } from 'react';
import { createNote, updateNote } from '../../services/notesService';

const emptyForm = { title: '', content: '', tags: '' };

const NotesEditor = ({ editing, onSave, onCancel }) => {
  const [form, setForm] = useState(
    editing ? { title: editing.title, content: editing.content, tags: editing.tags?.join(', ') || '' } : emptyForm
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (file) fd.append('file', file);

      const result = editing ? await updateNote(editing._id, fd) : await createNote(fd);
      onSave(result, !!editing);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card mb-2">
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>{editing ? 'Edit Note' : 'New Note'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="dsa, os, dbms" />
        </div>
        <div className="form-group">
          <label>Attach File (PDF/Image)</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={e => setFile(e.target.files[0])}
            style={{ background: 'transparent', border: 'none', padding: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Save Note'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NotesEditor;
