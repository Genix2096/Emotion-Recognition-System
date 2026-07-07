import { useRef, useState } from 'react';

/* ── Wave icon SVG ─────────────────────────────────────────────────────────── */
function WaveIcon({ active }) {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      style={{ transition: 'opacity 0.2s' }}
    >
      {/* outer ring */}
      <circle
        cx="26" cy="26" r="25"
        stroke={active ? '#6366f1' : '#3f3f46'}
        strokeWidth="1"
        strokeDasharray={active ? '4 2' : '3 3'}
        style={{ transition: 'stroke 0.25s' }}
      />
      {/* mic shape */}
      <rect x="21" y="10" width="10" height="18" rx="5"
        fill={active ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'}
        stroke={active ? '#818cf8' : '#52525b'}
        strokeWidth="1.25"
        style={{ transition: 'fill 0.25s, stroke 0.25s' }}
      />
      <path
        d="M16 26c0 5.523 4.477 10 10 10s10-4.477 10-10"
        stroke={active ? '#818cf8' : '#52525b'}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: 'stroke 0.25s' }}
      />
      <line
        x1="26" y1="36" x2="26" y2="42"
        stroke={active ? '#818cf8' : '#52525b'}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: 'stroke 0.25s' }}
      />
      <line
        x1="20" y1="42" x2="32" y2="42"
        stroke={active ? '#818cf8' : '#52525b'}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: 'stroke 0.25s' }}
      />
    </svg>
  );
}

/* ── Check icon ─────────────────────────────────────────────────────────────── */
function CheckCircle() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="21" stroke="#22c55e" strokeWidth="1.25" />
      <path d="M13 22l7 7 11-13" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const fmt = (bytes) => {
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/* ── Component ───────────────────────────────────────────────────────────────── */
export default function FileUploader({ file, onFileSelect }) {
  const [isDrag, setIsDrag] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.toLowerCase().endsWith('.wav')) onFileSelect(f);
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFileSelect(f);
  };

  const cls = [
    'drop-zone',
    isDrag  ? 'drag-active' : '',
    file    ? 'has-file'    : '',
  ].join(' ');

  return (
    <div>
      <div
        id="drop-zone"
        className={cls}
        style={{ padding: '2.5rem 2rem', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
        onDragOver={(e) => { e.preventDefault(); setIsDrag(true);  }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload WAV file"
      >
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept=".wav"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        {/* Icon */}
        <div className="wave-icon-wrap">
          {file ? <CheckCircle /> : <WaveIcon active={isDrag || hovered} />}
        </div>

        {/* Text */}
        {file ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e' }}>
              File ready to analyze
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 0.75rem', borderRadius: '0.5rem',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            }}>
              <span style={{ fontSize: '0.8rem', color: '#86efac', fontFamily: 'monospace' }}>
                ♫ {file.name.length > 36 ? `${file.name.slice(0,33)}…` : file.name}
              </span>
              <span style={{
                fontSize: '0.68rem', color: '#4ade80',
                background: 'rgba(34,197,94,0.15)', borderRadius: '99px',
                padding: '0.1rem 0.45rem',
              }}>{fmt(file.size)}</span>
            </div>
            <p style={{ fontSize: '0.73rem', color: '#52525b' }}>Click to replace</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isDrag ? '#a5b4fc' : '#a1a1aa' }}>
              {isDrag ? 'Release to upload' : 'Drag & drop your .wav file'}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#52525b' }}>
              or{' '}
              <span style={{ color: '#818cf8', textDecoration: 'underline', textUnderlineOffset: 3 }}>browse</span>
              {' '}to choose
            </p>
          </div>
        )}

        {/* Corner badge */}
        {!file && (
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em',
            color: '#6366f1', background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)', borderRadius: '99px',
            padding: '0.15rem 0.55rem',
          }}>WAV</div>
        )}
      </div>
    </div>
  );
}
