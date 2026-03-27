import { useState } from 'react';
import { runCode } from '../../services/problemService';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'c'];

const STARTERS = {
  javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
  python: '# Write your solution here\ndef solution():\n    pass\n',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n',
};

const CodeEditor = ({ problemId }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTERS['javascript']);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTERS[lang]);
    setOutput(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const result = await runCode({ source_code: code, language, stdin });
      setOutput(result);
    } catch (err) {
      setOutput({ stderr: err.response?.data?.message || 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  const statusColor = output?.status?.id === 3 ? 'var(--success)' : output?.stderr || output?.compile_output ? 'var(--danger)' : 'var(--text)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="flex-between">
        <select value={language} onChange={e => handleLanguageChange(e.target.value)} style={{ width: 'auto' }}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button className="btn btn-primary" onClick={handleRun} disabled={running}>
          {running ? '⏳ Running...' : '▶ Run Code'}
        </button>
      </div>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={16}
        spellCheck={false}
        style={{
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontSize: '0.85rem',
          lineHeight: 1.6,
          resize: 'vertical',
          background: '#0d1117',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1rem',
          color: '#e6edf3',
        }}
      />

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>stdin (optional)</label>
        <textarea
          value={stdin}
          onChange={e => setStdin(e.target.value)}
          rows={2}
          placeholder="Input for your program..."
          style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
      </div>

      {output && (
        <div className="card" style={{ background: '#0d1117', borderColor: statusColor }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {output.status?.description} {output.time ? `· ${output.time}s` : ''} {output.memory ? `· ${output.memory}KB` : ''}
          </p>
          <pre style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: statusColor, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {output.stdout || output.stderr || output.compile_output || 'No output'}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
