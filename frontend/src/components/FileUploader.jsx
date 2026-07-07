import { useRef, useState } from 'react';

/* ── Microphone SVG icon ────────────────────────────────────────────────── */
function MicIcon({ active }) {
  const col = active ? '#78A4CB' : '#64748B';
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ transition: 'all 0.2s' }}>
      {/* outer square frame */}
      <rect x="1" y="1" width="50" height="50" rx="5"
        stroke={col} strokeWidth="1.5" fill={active ? 'rgba(180,225,235,0.25)' : 'rgba(0,0,0,0.03)'}
        style={{ transition: 'all 0.2s' }}
      />
      {/* mic body */}
      <rect x="20" y="9" width="12" height="20" rx="6"
        fill={active ? '#B4E1EB' : '#E8F4F8'}
        stroke={col} strokeWidth="1.5"
        style={{ transition: 'all 0.2s' }}
      />
      {/* mic arc */}
      <path d="M14 26c0 6.627 5.373 12 12 12s12-5.373 12-12"
        stroke={col} strokeWidth="2" strokeLinecap="round"
        style={{ transition: 'stroke 0.2s' }}
      />
      {/* stand */}
      <line x1="26" y1="38" x2="26" y2="44" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="44" x2="33" y2="44" stroke={col} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Check icon ─────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="1" y="1" width="46" height="46" rx="5"
        stroke="#111111" strokeWidth="1.5" fill="rgba(180,225,235,0.5)" />
      <path d="M13 24l9 9 13-16" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── File size formatter ─────────────────────────────────────────────────── */
const fmt = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function FileUploader({ file, onFileSelect }) {
  const [isDrag,  setIsDrag]  = useState(false);
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

  const cls = ['drop-zone', isDrag ? 'drag-active' : '', file ? 'has-file' : ''].join(' ');

  return (
    <div>
      <div
        id="drop-zone"
        className={cls}
        style={{
          padding: '2.5rem 2rem',
          minHeight: 220,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '1rem',
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
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
          ref={inputRef} id="file-input"
          type="file" accept=".wav"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        {/* Icon */}
        <div className="wave-icon-wrap">
          {file ? <CheckIcon /> : <MicIcon active={isDrag || hovered} />}
        </div>

        {/* Text */}
        {file ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111111' }}>
              File ready to analyze
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 0.8rem',
              background: '#B4E1EB', border: '1px solid #111111', borderRadius: 4,
            }}>
              <span style={{ fontSize: '0.8rem', color: '#111111', fontFamily: 'monospace', fontWeight: 600 }}>
                ♪ {file.name.length > 36 ? `${file.name.slice(0, 33)}…` : file.name}
              </span>
              <span style={{
                fontSize: '0.68rem', fontWeight: 800, color: '#111111',
                background: '#F9E8A2', border: '1px solid #111111', borderRadius: 3,
                padding: '0.05rem 0.4rem',
              }}>
                {fmt(file.size)}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Click to replace</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: isDrag ? '#78A4CB' : '#334155' }}>
              {isDrag ? 'Release to upload' : 'Drag & drop your .wav file'}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              or{' '}
              <span style={{
                color: '#111111', fontWeight: 700,
                textDecoration: 'underline', textUnderlineOffset: 3,
                cursor: 'pointer',
              }}>
                browse
              </span>
              {' '}to choose
            </p>
          </div>
        )}

        {/* WAV badge */}
        {!file && (
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
            color: '#111111', background: '#F9E8A2',
            border: '1px solid #111111', borderRadius: 3,
            padding: '0.15rem 0.55rem',
          }}>
            WAV
          </div>
        )}
      </div>
    </div>
  );
}
