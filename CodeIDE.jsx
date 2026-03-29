import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Language config ─────────────────────────────────────────────────── */
const LANGUAGES = [
  { id: 'python',     label: 'Python',     color: '#3b82f6', pistonLang: 'python',     version: '3.10.0',  ext: 'py',  starter: '# Write your Python code here\nprint("Hello, World!")' },
  { id: 'cpp',        label: 'C++',        color: '#f472b6', pistonLang: 'c++',        version: '10.2.0',  ext: 'cpp', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { id: 'java',       label: 'Java',       color: '#f97316', pistonLang: 'java',       version: '15.0.2',  ext: 'java',starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 'c',          label: 'C',          color: '#94a3b8', pistonLang: 'c',          version: '10.2.0',  ext: 'c',   starter: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { id: 'javascript', label: 'JavaScript', color: '#eab308', pistonLang: 'javascript', version: '18.15.0', ext: 'js',  starter: '// Write your JavaScript code here\nconsole.log("Hello, World!");' },
  { id: 'typescript', label: 'TypeScript', color: '#60a5fa', pistonLang: 'typescript', version: '5.0.3',   ext: 'ts',  starter: '// Write your TypeScript code here\nconst greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("World"));' },
  { id: 'go',         label: 'Go',         color: '#22d3ee', pistonLang: 'go',         version: '1.16.2',  ext: 'go',  starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { id: 'rust',       label: 'Rust',       color: '#fb923c', pistonLang: 'rust',       version: '1.50.0',  ext: 'rs',  starter: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: 'kotlin',     label: 'Kotlin',     color: '#a78bfa', pistonLang: 'kotlin',     version: '1.6.20',  ext: 'kt',  starter: 'fun main() {\n    println("Hello, World!")\n}' },
  { id: 'ruby',       label: 'Ruby',       color: '#ef4444', pistonLang: 'ruby',       version: '3.0.1',   ext: 'rb',  starter: '# Write your Ruby code here\nputs "Hello, World!"' },
  { id: 'php',        label: 'PHP',        color: '#8b5cf6', pistonLang: 'php',        version: '8.2.3',   ext: 'php', starter: '<?php\necho "Hello, World!\\n";\n?>' },
  { id: 'bash',       label: 'Bash',       color: '#4ade80', pistonLang: 'bash',       version: '5.2.0',   ext: 'sh',  starter: '#!/bin/bash\necho "Hello, World!"' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24];

const THEMES = {
  dark:  { bg: '#0d1117', line: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#7d8590', num: '#495057' },
  light: { bg: '#ffffff', line: '#f6f8fa', border: '#d0d7de', text: '#1f2328', muted: '#656d76', num: '#9198a1' },
};

/* ── Syntax highlight (simple tokenizer) ─────────────────────────────── */
const KEYWORDS = {
  python:     /\b(def|class|import|from|return|if|else|elif|for|while|in|not|and|or|is|None|True|False|pass|break|continue|try|except|finally|with|as|lambda|yield|global|nonlocal|del|raise|assert|print)\b/g,
  javascript: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|class|new|this|typeof|instanceof|import|export|default|async|await|try|catch|finally|throw|null|undefined|true|false|of|in|switch|case|yield)\b/g,
  typescript: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|class|new|this|typeof|instanceof|import|export|default|async|await|try|catch|finally|throw|null|undefined|true|false|of|in|switch|case|type|interface|enum|namespace|declare|string|number|boolean|any|void)\b/g,
  cpp:        /\b(int|void|return|if|else|for|while|do|break|continue|class|struct|namespace|using|include|cout|cin|endl|string|auto|const|new|delete|public|private|protected|virtual|override|static|template|typename)\b/g,
  java:       /\b(public|private|protected|static|void|int|String|return|if|else|for|while|do|break|continue|class|new|this|import|package|interface|extends|implements|super|final|abstract|try|catch|finally|throw|throws|boolean|char|double|float|long|short|null|true|false)\b/g,
  c:          /\b(int|void|return|if|else|for|while|do|break|continue|struct|typedef|include|define|printf|scanf|char|float|double|long|short|unsigned|const|static|extern|auto|register|sizeof|null)\b/g,
  go:         /\b(func|package|import|return|if|else|for|range|break|continue|type|struct|interface|var|const|map|chan|go|defer|select|switch|case|default|nil|true|false|make|new|len|cap|append|copy|delete|close|println)\b/g,
  rust:       /\b(fn|let|mut|return|if|else|for|while|loop|break|continue|struct|impl|trait|use|mod|pub|crate|super|self|match|enum|type|where|async|await|move|ref|box|dyn|macro_rules|println|vec|string|bool|true|false|None|Some|Ok|Err)\b/g,
  kotlin:     /\b(fun|val|var|return|if|else|for|while|do|break|continue|class|object|interface|when|is|as|in|out|null|true|false|import|package|this|super|override|open|final|abstract|companion|data|sealed|init|constructor|by|get|set)\b/g,
  ruby:       /\b(def|class|module|return|if|else|elsif|unless|for|while|do|break|next|end|nil|true|false|require|puts|print|p|attr_accessor|attr_reader|attr_writer|begin|rescue|ensure|raise|yield|self|super|then|case|when|in)\b/g,
  php:        /\b(function|class|return|if|else|elseif|for|foreach|while|do|break|continue|echo|print|new|this|public|private|protected|static|extends|implements|interface|namespace|use|true|false|null|array|string|int|float|bool|void)\b/g,
  bash:       /\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|return|exit|echo|read|export|local|source|set|unset|readonly|break|continue|shift|test|true|false)\b/g,
};

function highlight(code, langId) {
  if (!code) return '';
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const colored = escaped
    // strings
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span style="color:#a5d6ff">$&</span>')
    // numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#79c0ff">$1</span>')
    // comments
    .replace(/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span style="color:#8b949e;font-style:italic">$1</span>');

  const pattern = KEYWORDS[langId];
  if (!pattern) return colored;
  pattern.lastIndex = 0;
  return colored.replace(pattern, '<span style="color:#ff7b72;font-weight:600">$&</span>');
}

/* ── Main Component ──────────────────────────────────────────────────── */
const CodeIDE = () => {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('ready'); // ready | running | success | error
  const [fontSize, setFontSize] = useState(14);
  const [showLangDrop, setShowLangDrop] = useState(false);
  const [showFontDrop, setShowFontDrop] = useState(false);
  const [lineCount, setLineCount] = useState(2);
  const [execTime, setExecTime] = useState(null);
  const [theme] = useState('dark');

  const textareaRef = useRef(null);
  const lineNumRef = useRef(null);
  const t = THEMES[theme];

  /* Sync line count */
  useEffect(() => {
    setLineCount(code.split('\n').length);
  }, [code]);

  /* Sync line numbers scroll with textarea */
  const syncScroll = () => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  /* Handle Tab key */
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = code.substring(0, start) + '    ' + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  /* Change language */
  const changeLang = (l) => {
    setLang(l);
    setCode(l.starter);
    setOutput('');
    setStatus('ready');
    setExecTime(null);
    setShowLangDrop(false);
  };

  /* Run code via Piston API */
  const runCode = useCallback(async () => {
    setStatus('running');
    setOutput('');
    setExecTime(null);
    const t0 = performance.now();
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang.pistonLang,
          version: '*',
          files: [{ name: `main.${lang.ext}`, content: code }],
          stdin: input,
        }),
      });
      const data = await res.json();
      const ms = Math.round(performance.now() - t0);
      setExecTime(ms);
      const out = data.run?.output || data.compile?.output || '';
      const err = data.run?.stderr || data.compile?.stderr || '';
      if (err && !out) {
        setOutput(err);
        setStatus('error');
      } else {
        setOutput(out + (err ? `\n\n⚠ stderr:\n${err}` : ''));
        setStatus('success');
      }
    } catch {
      setExecTime(null);
      setOutput('❌ Network error — could not reach the execution server.\nPlease check your internet connection.');
      setStatus('error');
    }
  }, [lang, code, input]);

  /* Keyboard shortcut Ctrl+Enter */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runCode();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runCode]);

  const isRunning = status === 'running';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--navbar-height))', background: '#010409', overflow: 'hidden' }}>

      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', height: 48, flexShrink: 0,
        background: '#0d1117', borderBottom: '1px solid #30363d',
        gap: '0.75rem',
      }}>
        {/* Left: title + lang selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e6edf3', fontWeight: 700, fontSize: '0.9rem' }}>
            <span style={{ color: '#6366f1', fontSize: '1.1rem' }}>{'</>'}</span>
            Code Editor
          </div>

          {/* Language dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowLangDrop(v => !v); setShowFontDrop(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'transparent', border: `1.5px solid ${lang.color}`,
                borderRadius: '8px', padding: '0.3rem 0.75rem',
                color: '#e6edf3', fontSize: '0.82rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: lang.color, display: 'inline-block', flexShrink: 0 }} />
              {lang.label}
              <span style={{ color: '#7d8590', fontSize: '0.65rem' }}>{showLangDrop ? '▲' : '▼'}</span>
            </button>

            {showLangDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                background: '#161b22', border: '1px solid #30363d',
                borderRadius: '12px', padding: '0.4rem',
                minWidth: '180px', zIndex: 1000,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                animation: 'slideUp 0.15s ease',
              }}>
                {LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => changeLang(l)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      width: '100%', padding: '0.5rem 0.75rem',
                      background: lang.id === l.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: 'none', borderRadius: '8px',
                      color: lang.id === l.id ? '#a5b4fc' : '#c9d1d9',
                      fontSize: '0.85rem', fontWeight: lang.id === l.id ? 700 : 400,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: l.color, display: 'inline-block', flexShrink: 0 }} />
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: font size + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Font size */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowFontDrop(v => !v); setShowLangDrop(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: 'transparent', border: '1px solid #30363d',
                borderRadius: '6px', padding: '0.3rem 0.6rem',
                color: '#7d8590', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              — {fontSize}px ▾
            </button>
            {showFontDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                background: '#161b22', border: '1px solid #30363d',
                borderRadius: '8px', padding: '0.35rem',
                zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {FONT_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setFontSize(s); setShowFontDrop(false); }}
                    style={{
                      display: 'block', width: '100%', padding: '0.35rem 0.9rem',
                      background: fontSize === s ? 'rgba(99,102,241,0.2)' : 'transparent',
                      border: 'none', borderRadius: '6px',
                      color: fontSize === s ? '#a5b4fc' : '#c9d1d9',
                      fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                  >{s}px</button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => { setCode(lang.starter); setOutput(''); setStatus('ready'); setExecTime(null); }}
            title="Reset code"
            style={{
              background: 'transparent', border: '1px solid #30363d',
              borderRadius: '6px', padding: '0.3rem 0.55rem',
              color: '#7d8590', fontSize: '0.9rem', cursor: 'pointer',
            }}
          >↺</button>

          {/* Copy */}
          <button
            onClick={() => { navigator.clipboard.writeText(code); }}
            title="Copy code"
            style={{
              background: 'transparent', border: '1px solid #30363d',
              borderRadius: '6px', padding: '0.3rem 0.55rem',
              color: '#7d8590', fontSize: '0.9rem', cursor: 'pointer',
            }}
          >⧉</button>

          {/* Run button */}
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: isRunning ? '#1f6feb80' : 'linear-gradient(135deg,#238636,#2ea043)',
              border: 'none', borderRadius: '8px',
              padding: '0.4rem 1.1rem',
              color: '#fff', fontSize: '0.85rem', fontWeight: 700,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.02em',
              boxShadow: isRunning ? 'none' : '0 0 16px rgba(46,160,67,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {isRunning
              ? <><span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid #ffffff60', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Running...</>
              : <>▶ Run Code</>
            }
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Code Editor */}
        <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #30363d', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

            {/* Line numbers */}
            <div
              ref={lineNumRef}
              style={{
                width: 48, flexShrink: 0,
                background: t.bg, color: '#495057',
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontSize, lineHeight: '1.6',
                padding: `0.65rem 0 0.65rem 0`,
                textAlign: 'right', paddingRight: '0.6rem',
                userSelect: 'none', overflowY: 'hidden',
                borderRight: '1px solid #21262d',
              }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} style={{ height: `calc(${fontSize}px * 1.6)` }}>{i + 1}</div>
              ))}
            </div>

            {/* Editor area */}
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: t.bg }}>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={syncScroll}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                style={{
                  position: 'absolute', inset: 0,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                  fontSize, lineHeight: '1.6',
                  padding: '0.65rem 1rem',
                  background: t.bg,
                  color: '#e6edf3',
                  caretColor: '#e6edf3',
                  border: 'none', outline: 'none', resize: 'none',
                  width: '100%', height: '100%',
                  whiteSpace: 'pre', overflowX: 'auto', overflowY: 'auto',
                  tabSize: 4,
                }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 0.75rem', height: 28, flexShrink: 0,
            background: '#010409', borderTop: '1px solid #21262d',
            fontSize: '0.72rem', color: '#7d8590',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: status === 'error' ? '#f85149' : status === 'success' ? '#3fb950' : '#7d8590' }}>
                ●{' '}
                {status === 'ready' ? 'Ready' : status === 'running' ? 'Running…' : status === 'success' ? 'Success' : 'Error'}
              </span>
              <span>{lang.label} • UTF-8</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {execTime && <span>⏱ {execTime}ms</span>}
              <span>Ln {lineCount}, Col 1</span>
            </div>
          </div>
        </div>

        {/* Right: Input + Output panels */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Input panel */}
          <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #30363d' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 1rem', borderBottom: '1px solid #21262d',
              background: '#0d1117',
            }}>
              <span style={{ fontSize: '0.8rem' }}>⌨</span>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#c9d1d9' }}>Input</span>
              <span style={{
                background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                borderRadius: '4px', padding: '0.1rem 0.45rem',
                fontSize: '0.68rem', fontWeight: 700,
              }}>stdin</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter input here..."
              spellCheck={false}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                background: '#010409', color: '#c9d1d9',
                fontFamily: "'Fira Code', monospace", fontSize: '0.85rem',
                padding: '0.75rem 1rem', lineHeight: 1.6,
              }}
            />
          </div>

          {/* Output panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 1rem', borderBottom: '1px solid #21262d',
              background: '#0d1117',
            }}>
              <span style={{ fontSize: '0.8rem' }}>▤</span>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#c9d1d9' }}>Output</span>
              <span style={{
                background: status === 'error' ? 'rgba(248,81,73,0.15)' : 'rgba(63,185,80,0.12)',
                color: status === 'error' ? '#f85149' : '#3fb950',
                borderRadius: '4px', padding: '0.1rem 0.45rem',
                fontSize: '0.68rem', fontWeight: 700,
                transition: 'all 0.3s',
              }}>
                {status === 'error' ? 'stderr' : 'stdout'}
              </span>
              {output && (
                <button
                  onClick={() => { setOutput(''); setStatus('ready'); setExecTime(null); }}
                  style={{
                    marginLeft: 'auto', background: 'transparent', border: 'none',
                    color: '#7d8590', fontSize: '0.75rem', cursor: 'pointer',
                  }}
                >✕ Clear</button>
              )}
            </div>
            <div style={{
              flex: 1, overflowY: 'auto',
              background: '#010409',
              fontFamily: "'Fira Code', monospace", fontSize: '0.85rem',
              padding: '0.75rem 1rem', lineHeight: 1.65,
              color: output
                ? (status === 'error' ? '#f85149' : '#3fb950')
                : '#495057',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {isRunning ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7d8590' }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #30363d', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Executing code...
                </div>
              ) : output || 'Output will appear here...'}
            </div>
          </div>
        </div>
      </div>

      {/* click-away to close dropdowns */}
      {(showLangDrop || showFontDrop) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => { setShowLangDrop(false); setShowFontDrop(false); }}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default CodeIDE;
